from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
from auth.schemas.user_schema import UserView

class IAuthService(ABC):
        
    @abstractmethod
    def authenticate_user(self, credentials: Dict) -> Tuple[str, UserView]:
        raise NotImplementedError

    @abstractmethod
    def logout_user(self, token: str) -> None:
        raise NotImplementedError

    @abstractmethod
    def verify_token_status(self, token: str) -> None:
        raise NotImplementedError

    @abstractmethod
    def get_user_from_token(self, token: str) -> Any:
        raise NotImplementedError