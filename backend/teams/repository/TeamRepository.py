from sqlalchemy.orm import Session
from typing import List, Optional
from teams.interfaces.ITeamRepository import ITeamRepository
from teams.schemas.team_schema import TeamInputModel, TeamViewModel
from shared.database import TeamTable

class TeamRepository(ITeamRepository):
    def __init__(self, db: Session):
        self._db = db

    def create_team(self, team_data: TeamInputModel) -> TeamViewModel:
        db_team = TeamTable(**team_data.model_dump())
        self._db.add(db_team)
        self._db.commit()
        self._db.refresh(db_team)
        return TeamViewModel.model_validate(db_team)

    def list_teams(self) -> List[TeamViewModel]:
        db_teams = self._db.query(TeamTable).all()
        return [TeamViewModel.model_validate(team) for team in db_teams]

    def get_team_by_name(self, nome: str) -> Optional[TeamViewModel]:
        db_team = self._db.query(TeamTable).filter(TeamTable.nome == nome).first()
        if db_team:
            return TeamViewModel.model_validate(db_team)
        return None

    def get_team_by_id(self, team_id: int) -> Optional[TeamViewModel]:
        db_team = self._db.query(TeamTable).filter(TeamTable.id == team_id).first()
        if db_team:
            return TeamViewModel.model_validate(db_team)
        return None

    def update_team(self, team_id: int, update_data: dict) -> Optional[TeamViewModel]:
        db_team = self._db.query(TeamTable).filter(TeamTable.id == team_id).first()
        if db_team:
            for key, value in update_data.items():
                setattr(db_team, key, value)
            self._db.commit()
            self._db.refresh(db_team)
            return TeamViewModel.model_validate(db_team)
        return None

    def delete_team(self, team_id: int) -> bool:
        db_team = self._db.query(TeamTable).filter(TeamTable.id == team_id)
        if db_team.first():
            db_team.delete()
            self._db.commit()
            return True
        return False