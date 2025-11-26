from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from auth.schemas.user_schema import UserView

class IUserRepository(ABC):
    @abstractmethod
    def list_all_users(self) -> List[UserView]:
        raise NotImplementedError

    @abstractmethod
    def create_user(self, user_data: Dict) -> Optional[UserView]:
        raise NotImplementedError

    @abstractmethod
    def update_user(self, user_id: int, update_data: Dict) -> Optional[UserView]:
        raise NotImplementedError

    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        raise NotImplementedError