from abc import ABC, abstractmethod
from typing import Optional, Dict
from auth.schemas.user_schema import UserView, UserEntity

class IAuthRepository(ABC):
    
    @abstractmethod
    async def create_user(self, user_data: Dict) -> UserView:
        raise NotImplementedError
        
    @abstractmethod
    async def find_by_email(self, email: str) -> Optional[UserEntity]:
        raise NotImplementedError