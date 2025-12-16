from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from shared.database import get_db
from auth.model import User

from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IUserService import IUserService

from auth.repository.UserRepository import UserRepository
from auth.repository.AuthRepository import AuthRepository
from auth.service.AuthService import AuthService
from auth.service.UserService import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_auth_service(db: Session = Depends(get_db)) -> IAuthService:
    """
    Factory centralizado do AuthService.
    Agora passa os DOIS repositórios que o serviço exige.
    """
    user_repo = UserRepository(db)
    auth_repo = AuthRepository(db)
    return AuthService(auth_repo, user_repo)

def get_user_service(db: Session = Depends(get_db)) -> IUserService:
    """
    Factory centralizado do UserService.
    """
    user_repo = UserRepository(db)
    return UserService(user_repo)

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    service: IAuthService = Depends(get_auth_service)
) -> User:
    return service.get_user_from_token(token)

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado: Requer privilégios de administrador"
        )
    return current_user