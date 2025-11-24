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

class UserInput(BaseModel):
    email: EmailStr
    password: str
    name: str
    last_name: str
    cpf: str
    birth_date: date

class UserView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: EmailStr
    name: str
    last_name: str
    cpf: str
    birth_date: date