from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from shared.database import get_db
from auth.dependencies import get_current_admin
from admin.repository.admin_repository import AdminRepository
from admin.schemas import AdminCreateUserRequest, AdminUpdateUserRequest
from auth.schemas.user_schema import UserView
from shared.security import get_password_hash

router = APIRouter(
    prefix="/admin",
    tags=["Administrativo"],
    dependencies=[Depends(get_current_admin)]
)

@router.get("/users", response_model=List[UserView])
def list_users(db: Session = Depends(get_db)):
    repo = AdminRepository(db)
    return repo.list_all_users()

@router.post("/users", response_model=UserView, status_code=status.HTTP_201_CREATED)
def create_user(user_in: AdminCreateUserRequest, db: Session = Depends(get_db)):
    repo = AdminRepository(db)
    user_dict = user_in.model_dump()
    password_plain = user_dict.pop("password")
    user_dict["password_hash"] = get_password_hash(password_plain)
    
    new_user = repo.create_user(user_dict)
    if not new_user:
        raise HTTPException(status_code=400, detail="Email já existe")
    return new_user

@router.patch("/users/{user_id}", response_model=UserView)
def update_user(user_id: int, user_update: AdminUpdateUserRequest, db: Session = Depends(get_db)):
    repo = AdminRepository(db)
    update_data = user_update.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        password_plain = update_data.pop("password")
        update_data["password_hash"] = get_password_hash(password_plain)
        
    updated_user = repo.update_user(user_id, update_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return updated_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    repo = AdminRepository(db)
    success = repo.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return None