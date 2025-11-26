from fastapi import APIRouter, Depends, status
from typing import List

from auth.dependencies import get_current_admin
from auth.schemas.user_schema import UserView
from admin.schemas.schemas import AdminCreateUserRequest, AdminUpdateUserRequest

# Usamos a Interface do Service
from admin.interfaces.IAdminService import IAdminService 
from admin.schemas.schemas import AdminCreateUserRequest, AdminUpdateUserRequest

router = APIRouter(
    prefix="/admin",
    tags=["Administrativo"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/users", response_model=List[UserView])
def list_users(service: IAdminService = Depends()):
    return service.list_users()

@router.post("/users", response_model=UserView, status_code=status.HTTP_201_CREATED)
def create_user(user_in: AdminCreateUserRequest, service: IAdminService = Depends()):
    return service.create_user(user_in)

@router.patch("/users/{user_id}", response_model=UserView)
def update_user(user_id: int, user_update: AdminUpdateUserRequest, service: IAdminService = Depends()):
    return service.update_user(user_id, user_update)

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, service: IAdminService = Depends()):
    return service.delete_user(user_id)