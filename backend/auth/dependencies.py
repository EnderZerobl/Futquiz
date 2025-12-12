from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from shared.security import SECRET_KEY, ALGORITHM
from shared.database import get_db
from auth.repository.UserRepository import UserRepository
from auth.repository.AuthRepository import AuthRepository # <--- Novo Import
from auth.model import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> User:
    """
    Decodifica o token, verifica a BLOCKLIST e busca o usuário no banco.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido, expirado ou usuário não encontrado.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    auth_repo = AuthRepository(db)
    if auth_repo.is_token_blocked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sessão finalizada. Faça login novamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    repository = UserRepository(db)
    user = repository.get_user_by_email(email)

    if user is None:
        raise credentials_exception

    return user

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Verifica se o usuário logado é admin.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado: Requer privilégios de administrador"
        )
    return current_user