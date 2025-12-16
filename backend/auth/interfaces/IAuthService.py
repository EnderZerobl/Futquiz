from abc import ABC, abstractmethod
from typing import Dict

class IAuthService(ABC):
        
    @abstractmethod
    def authenticate_user(self, credentials: Dict) -> str:
        raise NotImplementedError

    @abstractmethod
    def logout_user(self, token: str) -> None:
        raise NotImplementedError

    @abstractmethod
    def verify_token_status(self, token: str) -> None:
        raise NotImplementedError