from teams.interfaces.ITeamRepository import ITeamRepository
from teams.schemas.team_schema import TeamInputModel, TeamViewModel
from fastapi import Depends, HTTPException, status
from typing import List, Optional

class TeamService:
    def __init__(self, repository: ITeamRepository = Depends()):
        self._repository = repository

    def create_team(self, team_data: TeamInputModel) -> TeamViewModel:
        if self._repository.get_team_by_name(team_data.nome):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Time com este nome já cadastrado."
            )
        return self._repository.create_team(team_data)

    def list_teams(self) -> List[TeamViewModel]:
        return self._repository.list_teams()

    def update_team(self, team_id: int, update_data: dict) -> Optional[TeamViewModel]:
        if not self._repository.get_team_by_id(team_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Time não encontrado.")
        
        if 'nome' in update_data and self._repository.get_team_by_name(update_data['nome']):
             raise HTTPException(status.HTTP_409_CONFLICT, detail="Novo nome do time já está em uso.")
             
        return self._repository.update_team(team_id, update_data)

    def delete_team(self, team_id: int) -> bool:
        if not self._repository.delete_team(team_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Time não encontrado.")
        return True