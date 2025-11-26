from auth.interfaces.IAuthService import IAuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.schemas.user_schema import UserInput, UserView, UserEntity
from fastapi import HTTPException, status, Depends
from typing import Dict, Optional
from shared.security import get_password_hash, verify_password, create_access_token, decode_access_token, oauth2_scheme 
from datetime import date, timedelta
from shared.database import UserTable, get_db
from sqlalchemy.orm import Session
from sqlalchemy.future import select

class AuthService(IAuthService):

    def __init__(self, repository: IAuthRepository):
        self.repository = repository

    def register_user(self, user_input: UserInput) -> UserView:
        age_limit = date.today() - timedelta(days=18*365.25)
        if user_input.birth_date > age_limit:
             raise ValueError("Você deve ter no mínimo 18 anos para se cadastrar.")
             
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
            "is_admin": user_input.is_admin
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
            
        access_token = create_access_token(data={"sub": user_entity.email, "user_id": user_entity.id, "is_admin": user_entity.is_admin})
        return access_token

def get_current_admin(
    token: str = Depends(oauth2_scheme), 
    session: Session = Depends(get_db)  
) -> UserView:
    payload = decode_access_token(token)
    user_email: str = payload.get("sub")
    
    if user_email is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Token sem dados de usuário.")
    
    user_db = session.execute(
        select(UserTable).where(UserTable.email == user_email)
    ).scalars().first()
    
    if not user_db:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")

    if not user_db.is_admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Acesso negado. Requer privilégios de administrador.")
    
    return UserView.model_validate(user_db)