from abc import ABC, abstractmethod
from typing import List, Optional
from teams.schemas.team_schema import TeamInputModel, TeamViewModel

class ITeamRepository(ABC):
    
    @abstractmethod
    def create_team(self, team_data: TeamInputModel) -> TeamViewModel:
        pass
    
    @abstractmethod
    def list_teams(self) -> List[TeamViewModel]:
        pass

    @abstractmethod
    def get_team_by_name(self, nome: str) -> Optional[TeamViewModel]:
        pass
        
    @abstractmethod
    def get_team_by_id(self, team_id: int) -> Optional[TeamViewModel]:
        pass
        
    @abstractmethod
    def update_team(self, team_id: int, update_data: dict) -> Optional[TeamViewModel]:
        pass
        
    @abstractmethod
    def delete_team(self, team_id: int) -> bool:
        pass