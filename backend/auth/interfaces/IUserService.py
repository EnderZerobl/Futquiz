from abc import ABC, abstractmethod
from typing import List, Dict, Any
from auth.schemas.user_schema import UserUpdateInput

class IUserService(ABC):
    @abstractmethod
    def list_users(self) -> List[Any]:
        raise NotImplementedError

    @abstractmethod
    def create_user(self, user_data: Dict) -> Any:
        raise NotImplementedError

    @abstractmethod
    def update_user(self, user_id: int, update_data: UserUpdateInput) -> Any:
        raise NotImplementedError

    @abstractmethod
    def delete_user(self, user_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    def recover_password(self, email: str) -> None:
        raise NotImplementedError

    @abstractmethod
    def reset_password(self, token: str, new_password: str) -> None:
        raise NotImplementedError