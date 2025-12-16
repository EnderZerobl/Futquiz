from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Dict, Any
from auth.interfaces.IUserRepository import IUserRepository
from auth.model import User

class UserRepository(IUserRepository):
    def __init__(self, session: Session):
        self.db = session

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def list_all_users(self) -> List[User]:
        return self.db.query(User).all()

    def create_user(self, user_data: Dict) -> Optional[User]:
        try:
            new_user = User(**user_data) 
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
            return new_user
        except IntegrityError:
            self.db.rollback()
            return None

    def update_user(self, user_id: int, update_data: Dict) -> Optional[User]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None
            
        for key, value in update_data.items():
            if value is not None:
                setattr(user, key, value)
            
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        user = self.get_user_by_id(user_id)
        if user:
            self.db.delete(user)
            self.db.commit()
            return True
        return False