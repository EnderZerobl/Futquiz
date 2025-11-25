from auth.schemas.user_schema import UserInput
from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminCreateUserRequest(UserInput):
    is_admin: Optional[bool] = False

class AdminUpdateUserRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None