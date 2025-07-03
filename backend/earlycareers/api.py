from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, HTTPException, Query, status

from earlycareers import crud
from earlycareers.core import security
from earlycareers.deps import CurrentUser, SessionDep  # noqa: TC001
from earlycareers.models import SearchHistory, User
from earlycareers.schemas import (  # noqa: TC001
    BodyAuthLogin,
    HistoryCreate,
    HistoryRead,
    JobRead,
    Token,
    UserCreate,
    UserRead,
)

if TYPE_CHECKING:
    from earlycareers import schemas
    from earlycareers.models import Job

router = APIRouter()


@router.get("/healthcheck/", tags=["utils"])
def healthcheck() -> bool:
    return True


@router.get("/jobs", response_model=list[JobRead], tags=["jobs"])
def get_jobs(
    *,
    session: SessionDep,
    page: int = Query(1, ge=1),  # pyright: ignore[reportCallInDefaultInitializer]
    limit: int = Query(10, ge=1, le=100),  # pyright: ignore[reportCallInDefaultInitializer]
    search: str = Query(""),  # pyright: ignore[reportCallInDefaultInitializer]
) -> list[Job]:
    return crud.get_jobs(session=session, page=page, limit=limit, search=search)


@router.get("/jobs/advanced", response_model=list[JobRead], tags=["jobs"])
def get_jobs_advanced(
    *,
    session: SessionDep,
    page: int = Query(1, ge=1),  # pyright: ignore[reportCallInDefaultInitializer]
    limit: int = Query(10, ge=1, le=100),  # pyright: ignore[reportCallInDefaultInitializer]
    title: list[str] = Query(default_factory=list),  # noqa: B008
    company: list[str] = Query(default_factory=list),  # noqa: B008
    location: list[str] = Query(default_factory=list),  # noqa: B008
    description: list[str] = Query(default_factory=list),  # noqa: B008
) -> list[Job]:
    return crud.get_jobs_advanced(
        session=session,
        page=page,
        limit=limit,
        title=title,
        company=company,
        location=location,
        description=description,
    )


@router.post("/auth/signup", response_model=UserRead, tags=["auth"], status_code=201)
def signup(*, session: SessionDep, user_in: UserCreate) -> UserRead:
    hashed = security.get_password_hash(user_in.password)
    user = User(**user_in.model_dump(exclude={"password"}), hashed_password=hashed)
    return crud.create_user(session=session, user=user)


@router.post("/auth/login", response_model=Token, tags=["auth"])
def login(*, session: SessionDep, data: BodyAuthLogin) -> Token:
    user = crud.authenticate(
        session=session, username=data.username, password=data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    token = security.create_access_token(user.id)
    return Token(access_token=token)


@router.get("/users/me", response_model=UserRead, tags=["users"])
def get_me(current_user: CurrentUser) -> UserRead:
    return current_user


@router.patch("/users/me", response_model=UserRead, tags=["users"])
def update_me(
    *, session: SessionDep, current_user: CurrentUser, user_in: schemas.UserUpdate
) -> UserRead:
    return crud.update_user(session=session, user=current_user, user_in=user_in)


@router.post("/users/me/change-password", status_code=204, tags=["users"])
def change_password(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    data: schemas.ChangePassword,
) -> None:
    try:
        crud.change_password(
            session=session,
            user=current_user,
            old_password=data.old_password,
            new_password=data.new_password,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from exc


@router.post(
    "/search-history", response_model=HistoryRead, tags=["history"], status_code=201
)
def add_history(
    *, session: SessionDep, current_user: CurrentUser, history: HistoryCreate
) -> HistoryRead:
    record = SearchHistory(user_id=current_user.id, query=history.query)
    return crud.create_history(session=session, history=record)


@router.get("/search-history", response_model=list[HistoryRead], tags=["history"])
def list_history(
    *, session: SessionDep, current_user: CurrentUser
) -> list[HistoryRead]:
    return crud.get_history(session=session, user_id=current_user.id)
