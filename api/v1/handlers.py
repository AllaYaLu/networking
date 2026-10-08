from typing import Sequence
from pydantic import EmailStr
from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.models import CreateUser
from db.models import Users

async def get_all_users(session: AsyncSession) -> Sequence[Users]:
    stmt = select(Users)
    result = await session.execute(stmt)
    return result.scalars().all()

async def get_user_by_email(session: AsyncSession, email: EmailStr) -> Users | None:
    stmt = select(Users).where(Users.email == email)
    result = await session.execute(stmt)
    return result.scalars().first()

async def post_add_user(session: AsyncSession, user: CreateUser) -> bool:
    # Заменили устаревший .dict() на современный .model_dump()
    stmt = insert(Users).values(user.model_dump())
    result = await session.execute(stmt)
    await session.commit()
    
    # Современная и надежная проверка, что в БД вставилась строка
    return result.rowcount > 0

async def del_user_by_email(session: AsyncSession, email: EmailStr) -> bool:
    stmt = delete(Users).where(Users.email == email)
    result = await session.execute(stmt)
    await session.commit()
    return result.rowcount > 0

async def update_user_by_email(session: AsyncSession, email: EmailStr, about: str) -> bool:
    stmt = update(Users).where(Users.email == email).values(about=about)
    result = await session.execute(stmt)
    await session.commit()
    return result.rowcount > 0
