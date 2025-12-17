from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer 
from datetime import date

from auth.schemas.user_schema import UserInput, UserView, UserLogin, PasswordRecoveryRequest, PasswordResetConfirm, LoginResponse

from auth.dependencies import get_auth_service, get_user_service

from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IUserService import IUserService

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=LoginResponse,
    summary="Autentica o usuário e retorna o token JWT com dados do usuário"
)
async def login(
    credentials: UserLogin,
    service: IAuthService = Depends(get_auth_service)
):
    token, user = service.authenticate_user(credentials.model_dump())
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

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


@router.post(
    "/register",
    response_model=UserView,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo usuário"
)
async def register(
    user_data: UserInput,
    service: IUserService = Depends(get_user_service)
):
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A senha deve ter pelo menos 8 caracteres."
        )
    
    today = date.today()
    age = (today - user_data.birth_date).days // 365
    if age < 18:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você deve ter pelo menos 18 anos para se registrar."
        )
    
    user_dict = user_data.model_dump()
    user_dict['is_admin'] = False
    
    try:
        return service.create_user(user_dict)
    except HTTPException as e:
        if "já cadastrado" in e.detail.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Este email já está registrado."
            )
        raise e