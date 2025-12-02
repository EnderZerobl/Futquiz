from typing import List, Dict
from auth.interfaces.IUserService import IUserService
from auth.interfaces.IUserRepository import IUserRepository
from auth.schemas.user_schema import UserView, UserUpdateInput
from fastapi import HTTPException, status
from shared.security import get_password_hash

class UserService(IUserService):
    def __init__(self, repository: IUserRepository):
        self.repository = repository

    def list_users(self) -> List[UserView]:
        return self.repository.list_all_users()

    def create_user(self, user_data: Dict) -> UserView:
        if 'password' in user_data:
            user_data['password_hash'] = get_password_hash(user_data.pop('password'))
        
        new_user = self.repository.create_user(user_data)
        if new_user is None:
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Email ou CPF já registrado.")
            
        return new_user

    def update_user(self, user_id: int, update_data: UserUpdateInput) -> UserView:
        data_dict = update_data.model_dump(exclude_unset=True)
        
        if 'password' in data_dict:
            data_dict['password_hash'] = get_password_hash(data_dict.pop('password'))
            
        updated_user = self.repository.update_user(user_id, data_dict)
        if updated_user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")
            
        return updated_user

    def delete_user(self, user_id: int) -> None:
        if not self.repository.delete_user(user_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")