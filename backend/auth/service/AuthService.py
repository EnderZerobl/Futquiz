from typing import Dict
from fastapi import HTTPException, status
from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from shared.security import verify_password, create_access_token

class AuthService(IAuthService):

    def __init__(self, repository: IAuthRepository):
        self.repository = repository

    def authenticate_user(self, credentials: Dict) -> str:
        """
        Verifica email/senha e gera o token.
        """
        user = self.repository.find_by_email(credentials['email'])
        
        if not user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        if not verify_password(credentials['password'], user.password_hash):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        access_token = create_access_token(data={
            "sub": user.email, 
            "user_id": user.id, 
            "is_admin": user.is_admin
        })
        
        return access_token

    def logout_user(self, token: str) -> None:
        """
        Recebe o token e manda o repositório salvar na blocklist.
        """
        self.repository.add_token_to_blocklist(token)

    def verify_token_status(self, token: str) -> None:
        """
        Lança erro se o token estiver na blocklist.
        """
        if self.repository.is_token_blocked(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sessão finalizada. Faça login novamente."
            )