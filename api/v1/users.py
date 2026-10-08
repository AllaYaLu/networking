from http import HTTPStatus
from fastapi import APIRouter, Depends, HTTPException
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db_session
from api.v1.models import CreateUser, User
from api.v1.handlers import (
    get_all_users,
    get_user_by_email,
    post_add_user,
    del_user_by_email,
    update_user_by_email,
)


router = APIRouter()

@router.get("/", response_model=list[User])
async def get_users(session: AsyncSession = Depends(get_db_session)):
    users = await get_all_users(session)
    if not users:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No users found")
    return users

@router.get("/{email}", response_model=User)
async def get_user(email: EmailStr, session: AsyncSession = Depends(get_db_session)):
    user = await get_user_by_email(session, email)
    if not user:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No user found")
    return user

@router.post("/", response_model=User)
async def add_user(user: CreateUser, session: AsyncSession = Depends(get_db_session)):
    success = await post_add_user(session, user)
    if not success:
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="No user created")
    return user

@router.delete("/{email}", response_model=EmailStr)
async def delete_user(email: EmailStr, session: AsyncSession = Depends(get_db_session)):
    success = await del_user_by_email(session, email)
    if not success:
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail="No user deleted")
    return email

@router.patch("/{email}", response_model=str)
async def update_user(email: EmailStr, about: str, session: AsyncSession = Depends(get_db_session)):
    success = await update_user_by_email(session, email, about)
    if not success:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="No user updated")
    return about
