from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.schemas.user_schema import UserInput, UserView, UserEntity
from fastapi import HTTPException, status
from typing import Dict, Optional
from shared.security import get_password_hash, verify_password, create_access_token

class AuthService(IAuthService):
    def __init__(self, repository: IAuthRepository):
        self.repository = repository

    async def register_user(self, user_input: UserInput) -> UserView:
        if len(user_input.password) < 6:
            raise ValueError("A senha deve ter pelo menos 6 caracteres.")
        
        user_data = {
            "email": user_input.email,
            "password_hash": get_password_hash(user_input.password),
            "name": user_input.name
        }
        
        try:
            new_user = await self.repository.create_user(user_data)
            return new_user
        except ValueError as e:
             raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    async def authenticate_user(self, credentials: Dict) -> str:
        user_entity: Optional[UserEntity] = await self.repository.find_by_email(credentials['email'])
        
        if not user_entity:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        if not verify_password(credentials['password'], user_entity.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        access_token = create_access_token(data={"sub": user_entity.email, "user_id": user_entity.id})
        return access_token