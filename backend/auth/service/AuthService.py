from typing import Dict, Any, Tuple
from fastapi import HTTPException, status
from jose import JWTError, jwt

from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.interfaces.IUserRepository import IUserRepository
from auth.schemas.user_schema import UserView
from shared.security import verify_password, create_access_token, SECRET_KEY, ALGORITHM

class AuthService(IAuthService):

    def __init__(self, auth_repository: IAuthRepository, user_repository: IUserRepository):
        self.auth_repository = auth_repository
        self.user_repository = user_repository

    def authenticate_user(self, credentials: Dict) -> Tuple[str, UserView]:
        user = self.user_repository.get_user_by_email(credentials['email'])
        
        if not user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        if not verify_password(credentials['password'], user.password_hash):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        access_token = create_access_token(data={
            "sub": user.email, 
            "user_id": user.id, 
            "is_admin": user.is_admin
        })
        
        user_view = UserView.model_validate(user)
        return access_token, user_view

    def logout_user(self, token: str) -> None:
        self.auth_repository.add_token_to_blocklist(token)

    def verify_token_status(self, token: str) -> None:
        if self.auth_repository.is_token_blocked(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sessão finalizada. Faça login novamente.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def get_user_from_token(self, token: str) -> Any:
        """
        Centraliza a lógica de validação de token e recuperação de usuário.
        """
        self.verify_token_status(token)

        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido, expirado ou usuário não encontrado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        user = self.user_repository.get_user_by_email(email)

        if user is None:
            raise credentials_exception

        return user