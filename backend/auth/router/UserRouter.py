from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from sqlalchemy.orm import Session

from shared.database import get_db
from auth.repository.UserRepository import UserRepository
from auth.service.UserService import UserService
from auth.schemas.user_schema import UserView, UserInput, UserUpdateInput

from auth.dependencies import get_current_admin

router = APIRouter(
    prefix="/users",
    tags=["Administração de Usuários"],
)

def get_user_service(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return UserService(repo)


@router.get(
    "/",
    response_model=List[UserView],
    summary="Lista todos os usuários (Apenas Admin)",
)
def list_users(
    service: UserService = Depends(get_user_service),
    admin_user: UserView = Depends(get_current_admin)
):
    return service.list_users()

@router.post(
    "/",
    response_model=UserView,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo usuário (Apenas Admin)",
)
def create_user(
    user_data: UserInput,
    service: UserService = Depends(get_user_service),
    admin_user: UserView = Depends(get_current_admin)
):
    return service.create_user(user_data.model_dump())

@router.put(
    "/{user_id}",
    response_model=UserView,
    summary="Atualiza um usuário existente (Apenas Admin)",
)
def update_user(
    user_id: int,
    user_data: UserUpdateInput,
    service: UserService = Depends(get_user_service),
    admin_user: UserView = Depends(get_current_admin)
):
    return service.update_user(user_id, user_data)

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deleta um usuário (Apenas Admin)",
)
def delete_user(
    user_id: int,
    service: UserService = Depends(get_user_service),
    admin_user: UserView = Depends(get_current_admin)
):
    service.delete_user(user_id)
    return