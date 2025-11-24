from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.schemas.user_schema import UserInput, UserView, UserEntity
from fastapi import HTTPException, status
from typing import Dict, Optional
from shared.security import get_password_hash, verify_password, create_access_token 
from datetime import date, timedelta

class AuthService(IAuthService):

    def __init__(self, repository: IAuthRepository):
        self.repository = repository

    def register_user(self, user_input: UserInput) -> UserView:
        age_limit = date.today() - timedelta(days=16*365.25)
        if user_input.birth_date > age_limit:
             raise ValueError("Você deve ter no mínimo 16 anos para se cadastrar.")
             
        if len(user_input.password.encode('utf-8')) > 72:
            raise ValueError("A senha não pode exceder 72 caracteres.")
        if len(user_input.password) < 8:
            raise ValueError("A senha deve ter pelo menos 8 caracteres.")
        
        user_data = {
            "email": user_input.email,
            "password_hash": get_password_hash(user_input.password),
            "name": user_input.name,
            "last_name": user_input.last_name,
            "cpf": user_input.cpf,
            "birth_date": user_input.birth_date,
        }
        
        try:
            new_user = self.repository.create_user(user_data)
            return new_user
        except ValueError as e:
             raise HTTPException(status.HTTP_409_CONFLICT, detail=str(e))


    def authenticate_user(self, credentials: Dict) -> str:
        user_entity: Optional[UserEntity] = self.repository.find_by_email(credentials['email'])
        
        if not user_entity:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        if not verify_password(credentials['password'], user_entity.password_hash):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
            
        access_token = create_access_token(data={"sub": user_entity.email, "user_id": user_entity.id})
        return access_token