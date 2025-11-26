from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from auth.interfaces.IUserService import IUserService
from auth.schemas.user_schema import UserView, UserInput, UserUpdateInput
from auth.service.AuthService import get_current_admin

router = APIRouter(
    prefix="/users",
    tags=["Administração de Usuários"],
)

@router.get(
    "/",
    response_model=List[UserView],
    summary="Lista todos os usuários (ADM)",
)
def list_users(
    service: IUserService = Depends(),
    admin_user: UserView = Depends(get_current_admin)
):
    return service.list_users()

@router.post(
    "/",
    response_model=UserView,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo usuário (ADM)",
)
def create_user(
    user_data: UserInput,
    service: IUserService = Depends(),
    admin_user: UserView = Depends(get_current_admin)
):
    return service.create_user(user_data.model_dump())

@router.put(
    "/{user_id}",
    response_model=UserView,
    summary="Atualiza um usuário existente (ADM)",
)
def update_user(
    user_id: int,
    user_data: UserUpdateInput,
    service: IUserService = Depends(),
    admin_user: UserView = Depends(get_current_admin)
):
    return service.update_user(user_id, user_data)

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deleta um usuário (ADM)",
)
def delete_user(
    user_id: int,
    service: IUserService = Depends(),
    admin_user: UserView = Depends(get_current_admin)
):
    service.delete_user(user_id)
    return