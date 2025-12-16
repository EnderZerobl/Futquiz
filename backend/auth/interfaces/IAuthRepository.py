from abc import ABC, abstractmethod
from typing import Optional, Dict
from auth.schemas.user_schema import UserView, UserEntity

class IAuthRepository(ABC):
    
    @abstractmethod
    def create_user(self, user_data: Dict) -> UserView:
        raise NotImplementedError
        
    @abstractmethod
    def find_by_email(self, email: str) -> Optional[UserEntity]:
        raise NotImplementedError

    @abstractmethod
    def add_token_to_blocklist(self, token: str) -> None:
        raise NotImplementedError

    @abstractmethod
    def is_token_blocked(self, token: str) -> bool:
        raise NotImplementedError