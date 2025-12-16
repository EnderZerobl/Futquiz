from typing import Optional, Dict
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from auth.interfaces.IAuthRepository import IAuthRepository
from auth.schemas.user_schema import UserEntity, UserView
from shared.database import UserTable
from auth.model import TokenBlocklist

class AuthRepository(IAuthRepository):

    def __init__(self, session: Session):
        self.session = session 

    def create_user(self, user_data: Dict) -> UserView:
        try:
            new_user_db = UserTable(**user_data)
            self.session.add(new_user_db)
            self.session.commit()
            self.session.refresh(new_user_db)
            
            return UserView.model_validate(new_user_db)
            
        except IntegrityError:
            self.session.rollback()
            raise ValueError("Este email já está registrado.")
        
    def find_by_email(self, email: str) -> Optional[UserEntity]:
        try:
            stmt = select(UserTable).where(UserTable.email == email)
            result = self.session.execute(stmt)
            user_db = result.scalars().first()
            
            if user_db:
                return UserEntity.model_validate(user_db)
            return None
        except Exception as e:
            raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro interno ao buscar dados.")

    def add_token_to_blocklist(self, token: str) -> None:
        """Adiciona um token à lista de bloqueio (Logout)."""
        try:
            blocked_token = TokenBlocklist(token=token)
            self.session.add(blocked_token)
            self.session.commit()
        except IntegrityError:
            self.session.rollback()
            pass

    def is_token_blocked(self, token: str) -> bool:
        """Verifica se o token está na lista de bloqueio."""
        stmt = select(TokenBlocklist).where(TokenBlocklist.token == token)
        result = self.session.execute(stmt)
        return result.scalars().first() is not None