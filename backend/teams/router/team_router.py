from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Optional
from teams.schemas.team_schema import TeamInputModel, TeamViewModel
from teams.service.TeamService import TeamService
from auth.dependencies import get_current_admin

router = APIRouter()

@router.post("/create", response_model=TeamViewModel, status_code=status.HTTP_201_CREATED)
def create_team(
    team_data: TeamInputModel,
    team_service: TeamService = Depends(),
    admin_user: dict = Depends(get_current_admin)
):
    try:
        return team_service.create_team(team_data)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar time.")

@router.put("/update/{team_id}", response_model=TeamViewModel)
def update_team(
    team_id: int,
    update_data: TeamInputModel, 
    team_service: TeamService = Depends(),
    admin_user: dict = Depends(get_current_admin)
):
    """Atualiza dados de um time (Restrito a ADM)."""
    try:
        updated_team = team_service.update_team(team_id, update_data.model_dump(exclude_unset=True))
        if not updated_team:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Time não encontrado.")
        return updated_team
    except HTTPException as e:
        raise e

@router.delete("/delete/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(
    team_id: int,
    team_service: TeamService = Depends(),
    admin_user: dict = Depends(get_current_admin)
):
    """Deleta um time (Restrito a ADM)."""
    try:
        team_service.delete_team(team_id)
        return {"detail": "Time excluído com sucesso."}
    except HTTPException as e:
        raise e

@router.get("/list", response_model=List[TeamViewModel])
def list_teams(team_service: TeamService = Depends()):
    return team_service.list_teams()