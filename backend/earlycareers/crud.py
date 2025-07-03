from __future__ import annotations

import re
import uuid  # noqa: TC003
from typing import TYPE_CHECKING

from sqlmodel import and_, or_, select

from earlycareers.core import security

from .models import Job, SearchHistory, User

if TYPE_CHECKING:
    from sqlalchemy.sql.elements import ColumnElement
    from sqlmodel import Session

    from .schemas import UserUpdate

_TOKEN_RE = re.compile(r"\w+")
_SEARCHABLE = (
    Job.company,
    Job.title,
    Job.location,
    Job.description,
    Job.employment_type,
    Job.seniority_level,
    Job.job_function,
    Job.industries,
)


def _phrase_filter(
    column: ColumnElement[str], phrases: list[str] | None
) -> ColumnElement[bool] | None:
    """Return OR-combined filter for *phrases* against *column*."""
    if not phrases:
        return None

    phrase_exprs = []
    for phrase in phrases:
        tokens = _tokens(phrase)
        if not tokens:
            continue
        phrase_exprs.append(and_(*(column.ilike(f"%{t}%") for t in tokens)))

    return or_(*phrase_exprs) if phrase_exprs else None


def _tokens(text: str) -> list[str]:
    """Return lowercase word-tokens found in *text*."""
    return _TOKEN_RE.findall(text.lower())


def _token_filter(token: str) -> ColumnElement[bool]:
    """Filter that matches *token* against every searchable column (OR-combined)."""
    like_pattern = f"%{token}%"
    return or_(*(col.ilike(like_pattern) for col in _SEARCHABLE))  # pyright: ignore


def _search_filter(search: str) -> ColumnElement[bool] | None:
    """Return an AND-combined filter across all tokens in *search*."""
    tokens = _tokens(search)
    return and_(*(_token_filter(t) for t in tokens)) if tokens else None


def get_jobs(
    *, session: Session, page: int = 1, limit: int = 10, search: str = ""
) -> list[Job]:
    stmt = select(Job)
    search_filter = _search_filter(search)
    if search_filter is not None:
        stmt = stmt.where(search_filter)

    stmt = stmt.offset((page - 1) * limit).limit(limit)
    return list(session.exec(stmt).all())


def get_jobs_advanced(
    *,
    session: Session,
    page: int = 1,
    limit: int = 10,
    title: list[str] | None = None,
    company: list[str] | None = None,
    location: list[str] | None = None,
    description: list[str] | None = None,
) -> list[Job]:
    stmt = select(Job)

    filters = [
        _phrase_filter(Job.title, title),
        _phrase_filter(Job.company, company),
        _phrase_filter(Job.location, location),
        _phrase_filter(Job.description, description),
    ]
    actual_filters = [f for f in filters if f is not None]
    if actual_filters:
        stmt = stmt.where(and_(*actual_filters))

    stmt = stmt.offset((page - 1) * limit).limit(limit)
    return list(session.exec(stmt).all())


def authenticate(*, session: Session, username: str, password: str) -> User | None:
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        return None
    if not security.verify_password(password, user.hashed_password):
        return None
    return user


def create_user(*, session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def update_user(*, session: Session, user: User, user_in: UserUpdate) -> User:
    data = user_in.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def change_password(
    *, session: Session, user: User, old_password: str, new_password: str
) -> User:
    if not security.verify_password(old_password, user.hashed_password):
        msg = "Invalid password"
        raise ValueError(msg)
    user.hashed_password = security.get_password_hash(new_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def create_history(*, session: Session, history: SearchHistory) -> SearchHistory:
    session.add(history)
    session.commit()
    session.refresh(history)
    return history


def get_history(*, session: Session, user_id: uuid.UUID) -> list[SearchHistory]:
    stmt = (
        select(SearchHistory)
        .where(SearchHistory.user_id == user_id)
        .order_by(SearchHistory.created_at.desc())
    )
    return list(session.exec(stmt).all())
