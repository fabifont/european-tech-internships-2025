import uuid
from datetime import UTC, date, datetime

from sqlmodel import Field, SQLModel


class JobBase(SQLModel):
    link: str = Field(primary_key=True)
    title: str = Field(nullable=False)
    location: str = Field(nullable=False)
    company: str = Field(nullable=False)
    description: str | None = None
    employment_type: str | None = None
    seniority_level: str | None = None
    job_function: str | None = None
    industries: str | None = None


class Job(JobBase, table=True):
    __tablename__ = "jobs"  # pyright: ignore


class UUIDBase(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class UserBase(SQLModel):
    username: str = Field(unique=True, nullable=False, index=True)
    name: str | None = None
    surname: str | None = None
    birthdate: date | None = None
    email: str | None = None


class User(UUIDBase, UserBase, table=True):
    __tablename__ = "users"  # pyright: ignore[assignment-type]

    hashed_password: str = Field(nullable=False, index=True)


class SearchHistory(UUIDBase, table=True):
    __tablename__ = "search_history"  # pyright: ignore[assignment-type]

    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False, index=True)
    query: str = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC), nullable=False
    )
