from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer # <--- Import necessário para pegar o token
from sqlalchemy.orm import Session
from typing import Dict

# Imports do Projeto
from shared.database import get_db
from auth.repository.AuthRepository import AuthRepository # <--- Mudança: Usando AuthRepository
from auth.repository.UserRepository import UserRepository
from auth.service.AuthService import AuthService
from auth.service.UserService import UserService
from auth.schemas.user_schema import UserLogin, PasswordRecoveryRequest, PasswordResetConfirm

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)

# Esquema para extrair o token do header Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_auth_service(db: Session = Depends(get_db)):
    # Agora instanciamos o AuthRepository que tem os métodos de blocklist
    repo = AuthRepository(db)
    return AuthService(repo)

def get_user_service(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return UserService(repo)


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    summary="Autentica o usuário e retorna o token JWT"
)
async def login(
    credentials: UserLogin,
    service: AuthService = Depends(get_auth_service)
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
    service: UserService = Depends(get_user_service)
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
    service: UserService = Depends(get_user_service)
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
    service: AuthService = Depends(get_auth_service)
):
    """
    Recebe o token atual e o adiciona à Blocklist no banco de dados.
    Isso impede que o token seja usado novamente, mesmo que ainda esteja no prazo de validade.
    """
    service.logout_user(token)
    return {"message": "Logout realizado com sucesso."}