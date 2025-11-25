from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import date

class UserEntity(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: Optional[int] = None
    email: EmailStr
    password_hash: str
    name: str
    last_name: str
    cpf: str
    birth_date: date
    is_admin: bool

class UserInput(BaseModel):
    email: EmailStr
    password: str
    name: str
    last_name: str
    cpf: str
    birth_date: date
    is_admin: bool = False

class UserUpdateInput(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    name: Optional[str] = None
    last_name: Optional[str] = None
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    is_admin: Optional[bool] = None

class UserView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: EmailStr
    name: str
    last_name: str
    cpf: str
    birth_date: date
    is_admin: bool