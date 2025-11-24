from abc import ABC, abstractmethod
from typing import Dict
from auth.schemas.user_schema import UserInput, UserView

class IAuthService(ABC):
    
    @abstractmethod
    async def register_user(self, user_data: UserInput) -> UserView:
        raise NotImplementedError
        
    @abstractmethod
    async def authenticate_user(self, credentials: Dict) -> str:
        raise NotImplementedError