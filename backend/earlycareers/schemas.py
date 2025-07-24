from sqlmodel import SQLModel

from .models import JobBase


class SubscriptionCreate(SQLModel):
    email: str
    search_params: dict


class SubscriptionRead(SQLModel):
    id: int
    email: str
    active: bool


class JobRead(JobBase):
    pass
