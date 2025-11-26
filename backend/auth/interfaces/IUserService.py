from abc import ABC, abstractmethod
from typing import List
from auth.schemas.user_schema import UserView, UserUpdateInput

class IUserService(ABC):
    @abstractmethod
    def list_users(self) -> List[UserView]:
        raise NotImplementedError

    @abstractmethod
    def create_user(self, user_data: dict) -> UserView:
        raise NotImplementedError

    @abstractmethod
    def update_user(self, user_id: int, update_data: UserUpdateInput) -> UserView:
        raise NotImplementedError

    @abstractmethod
    def delete_user(self, user_id: int) -> None:
        raise NotImplementedError