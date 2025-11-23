from pydantic import BaseModel, EmailStr
from typing import Optional

class UserEntity(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    password_hash: str 
    name: str

class UserInput(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserView(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        from_attributes = True