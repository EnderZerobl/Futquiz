from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Dict
from auth.interfaces.IUserRepository import IUserRepository
from auth.schemas.user_schema import UserView
from shared.database import UserTable 
from fastapi import HTTPException, status
from sqlalchemy.future import select

class UserRepository(IUserRepository):
    def __init__(self, session: Session):
        self.db = session

    def list_all_users(self) -> List[UserView]:
        users_db = self.db.query(UserTable).all()
        return [UserView.model_validate(user) for user in users_db]

    def create_user(self, user_data: dict) -> Optional[UserView]:
        try:
            new_user = UserTable(**user_data) 
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
            return UserView.model_validate(new_user)
        except IntegrityError:
            self.db.rollback()
            return None

    def update_user(self, user_id: int, update_data: dict) -> Optional[UserView]:
        user = self.db.query(UserTable).filter(UserTable.id == user_id).first()
        if not user:
            return None
            
        for key, value in update_data.items():
            setattr(user, key, value)
            
        self.db.commit()
        self.db.refresh(user)
        return UserView.model_validate(user)

    def delete_user(self, user_id: int) -> bool:
        user = self.db.query(UserTable).filter(UserTable.id == user_id).first()
        if user:
            self.db.delete(user)
            self.db.commit()
            return True
        return False