from abc import ABC, abstractmethod
from typing import List, Optional
from auth.schemas.user_schema import UserView
from admin.schemas.schemas import AdminCreateUserRequest, AdminUpdateUserRequest

# Contrato do Repositório
class IAdminRepository(ABC):
    @abstractmethod
    def list_all_users(self): pass
    
    @abstractmethod
    def create_user(self, user_data: dict): pass
    
    @abstractmethod
    def update_user(self, user_id: int, update_data: dict): pass
    
    @abstractmethod
    def delete_user(self, user_id: int) -> bool: pass