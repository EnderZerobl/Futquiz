from abc import ABC, abstractmethod
from typing import List, Optional
from auth.schemas.user_schema import UserView
from admin.schemas.schemas import AdminCreateUserRequest, AdminUpdateUserRequest


class IAdminService(ABC):
    @abstractmethod
    def list_users(self) -> List[UserView]: pass

    @abstractmethod
    def create_user(self, user_in: AdminCreateUserRequest) -> UserView: pass

    @abstractmethod
    def update_user(self, user_id: int, user_in: AdminUpdateUserRequest) -> UserView: pass

    @abstractmethod
    def delete_user(self, user_id: int) -> None: pass