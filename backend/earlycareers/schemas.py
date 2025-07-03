import uuid
from datetime import date, datetime

from sqlmodel import SQLModel

from .models import JobBase, UserBase, UUIDBase


class JobRead(JobBase):
    pass


class Token(SQLModel):
    access_token: str


class UserCreate(UserBase):
    password: str


class BodyAuthLogin(SQLModel):
    username: str
    password: str


class UserRead(UserBase, UUIDBase):
    pass


class UserUpdate(SQLModel):
    username: str | None = None
    name: str | None = None
    surname: str | None = None
    birthdate: date | None = None
    email: str | None = None


class ChangePassword(SQLModel):
    old_password: str
    new_password: str


class HistoryCreate(SQLModel):
    query: str


class HistoryRead(HistoryCreate, UUIDBase):
    user_id: uuid.UUID
    created_at: datetime
