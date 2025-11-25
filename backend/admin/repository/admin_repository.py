from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from auth.model import User 

class AdminRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_all_users(self):
        return self.db.query(User).all()

    def create_user(self, user_data: dict):
        try:
            new_user = User(**user_data)
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
            return new_user
        except IntegrityError:
            self.db.rollback()
            return None

    def update_user(self, user_id: int, update_data: dict):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
            
        for key, value in update_data.items():
            setattr(user, key, value)
            
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            self.db.delete(user)
            self.db.commit()
            return True
        return False