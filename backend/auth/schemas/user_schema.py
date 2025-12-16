from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from typing import Optional
from datetime import date
import re

def validar_forca_senha(senha: str) -> str:
    if len(senha) < 8:
        raise ValueError('A senha deve ter no mínimo 8 caracteres.')
    if not re.search(r'[0-9]', senha):
        raise ValueError('A senha deve conter pelo menos um número.')
    if not re.search(r'[^a-zA-Z0-9]', senha):
        raise ValueError('A senha deve conter pelo menos um caractere especial (!@#$...).')
    return senha

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

class UserView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: EmailStr
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

    @field_validator('password')
    def validar_senha(cls, v):
        return validar_forca_senha(v)

class UserUpdateInput(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    name: Optional[str] = None
    last_name: Optional[str] = None
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    is_admin: Optional[bool] = None

    @field_validator('password')
    def validar_senha(cls, v):
        if v is not None: # Só valida se o usuário enviou uma senha nova
            return validar_forca_senha(v)
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordRecoveryRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

    @field_validator('new_password')
    def validar_senha(cls, v):
        return validar_forca_senha(v)