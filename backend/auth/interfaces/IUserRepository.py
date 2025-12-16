from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

class IUserRepository(ABC):
    @abstractmethod
    def list_all_users(self) -> List[Any]:
        raise NotImplementedError

    @abstractmethod
    def get_user_by_email(self, email: str) -> Any:
        raise NotImplementedError

    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Any:
        raise NotImplementedError

    @abstractmethod
    def create_user(self, user_data: Dict) -> Any:
        raise NotImplementedError

    @abstractmethod
    def update_user(self, user_id: int, update_data: Dict) -> Any:
        raise NotImplementedError

    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        raise NotImplementedError