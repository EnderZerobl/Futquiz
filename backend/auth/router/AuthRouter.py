from fastapi import APIRouter, Depends, status, HTTPException
from auth.interfaces.IAuthService import IAuthService
from auth.schemas.user_schema import UserInput, UserView
from typing import Dict

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)
@router.post(
    "/register",
    response_model=UserView, 
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo usuário"
)
async def register(
    user_data: UserInput,  
    service: IAuthService = Depends() 
):
    try:
        new_user = await service.register_user(user_data)
        return new_user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="Autentica o usuário e retorna o token JWT"
)
async def login(
    credentials: Dict, 
    service: IAuthService = Depends() 
):
    try:
        token = await service.authenticate_user(credentials)
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException as e:
        raise e