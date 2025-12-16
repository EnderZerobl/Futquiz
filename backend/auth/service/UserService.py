from typing import List, Dict
from fastapi import HTTPException, status
from auth.interfaces.IUserService import IUserService
from auth.interfaces.IUserRepository import IUserRepository
from auth.schemas.user_schema import UserView, UserUpdateInput
from shared.security import get_password_hash

class UserService(IUserService):
    def __init__(self, repository: IUserRepository):
        self.repository = repository

    def list_users(self) -> List[UserView]:
        users_models = self.repository.list_all_users()
        return [UserView.model_validate(user) for user in users_models]

    def create_user(self, user_data: Dict) -> UserView:
        # Verifica duplicidade
        if self.repository.get_user_by_email(user_data['email']):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado.")

        # Hash da senha
        if 'password' in user_data:
            user_data['password_hash'] = get_password_hash(user_data.pop('password'))
        
        new_user = self.repository.create_user(user_data)
        
        if new_user is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Erro ao criar usuário.")
            
        return UserView.model_validate(new_user)

    def update_user(self, user_id: int, update_data: UserUpdateInput) -> UserView:
        data_dict = update_data.model_dump(exclude_unset=True)
        
        if 'password' in data_dict:
            data_dict['password_hash'] = get_password_hash(data_dict.pop('password'))
            
        updated_user = self.repository.update_user(user_id, data_dict)
        
        if updated_user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")
            
        return UserView.model_validate(updated_user)

    def delete_user(self, user_id: int) -> None:
        if not self.repository.delete_user(user_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")


    def recover_password(self, email: str) -> None:
        user = self.repository.get_user_by_email(email)
        if not user:
            return
        
        print(f"--- SIMULAÇÃO DE EMAIL ---")
        print(f"Para: {email}")
        print(f"Token (Simulado): {email}") 
        print(f"--------------------------")

    def reset_password(self, token: str, new_password: str) -> None:
        email_do_token = token 
        
        user = self.repository.get_user_by_email(email_do_token)
        
        if not user:
             raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Token inválido.")

        new_hash = get_password_hash(new_password)
        self.repository.update_user(user.id, {"password_hash": new_hash})