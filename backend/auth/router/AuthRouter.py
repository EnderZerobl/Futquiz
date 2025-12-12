from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordBearer 

from auth.dependencies import get_auth_service, get_user_service

from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IUserService import IUserService

from auth.schemas.user_schema import UserLogin, PasswordRecoveryRequest, PasswordResetConfirm

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="Autentica o usuário e retorna o token JWT"
)
async def login(
    credentials: UserLogin,
    service: IAuthService = Depends(get_auth_service) # Injeção via Interface
):
    token = service.authenticate_user(credentials.model_dump())
    return {"access_token": token, "token_type": "bearer"}

@router.post(
    "/recover-password",
    status_code=status.HTTP_200_OK,
    summary="Envia email para recuperação de senha"
)
async def recover_password(
    data: PasswordRecoveryRequest,
    service: IUserService = Depends(get_user_service)
):
    service.recover_password(data.email)
    return {"message": "Se o e-mail estiver cadastrado, as instruções foram enviadas."}

@router.post(
    "/reset-password",
    status_code=status.HTTP_200_OK,
    summary="Define a nova senha usando o token recebido"
)
async def reset_password(
    data: PasswordResetConfirm,
    service: IUserService = Depends(get_user_service)
):
    service.reset_password(data.token, data.new_password)
    return {"message": "Senha alterada com sucesso."}

@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Realiza o logout invalidando o token atual"
)
async def logout(
    token: str = Depends(oauth2_scheme),
    service: IAuthService = Depends(get_auth_service)
):
    service.logout_user(token)
    return {"message": "Logout realizado com sucesso."}