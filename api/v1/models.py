from pydantic import BaseModel, EmailStr, UUID4

class User(BaseModel):
    id: UUID4 | None = None
    name: str
    surname: str
    email: EmailStr | None = None
    about: str | None = None

class CreateUser(BaseModel):
    name: str
    surname: str
    email: EmailStr | None = None
    about: str | None = None
