from fastapi import HTTPException, status
from admin.interfaces.IAdminService import IAdminService
from admin.interfaces.IAdminRepository import IAdminRepository
from admin.schemas.schemas import AdminCreateUserRequest, AdminUpdateUserRequest
from shared.security import get_password_hash

class AdminService(IAdminService):
    def __init__(self, repository: IAdminRepository):
        self.repository = repository

    def list_users(self):
        return self.repository.list_all_users()

    def create_user(self, user_in: AdminCreateUserRequest):
        # Lógica de Negócio (Hash senha) agora fica aqui!
        user_dict = user_in.model_dump()
        password_plain = user_dict.pop("password")
        user_dict["password_hash"] = get_password_hash(password_plain)
        
        new_user = self.repository.create_user(user_dict)
        
        if not new_user:
            raise HTTPException(status_code=400, detail="Email já existe")
            
        return new_user

    def update_user(self, user_id: int, user_in: AdminUpdateUserRequest):
        update_data = user_in.model_dump(exclude_unset=True)
        
        # Lógica de Negócio (Se tem senha, faz hash)
        if "password" in update_data:
            password_plain = update_data.pop("password")
            update_data["password_hash"] = get_password_hash(password_plain)
            
        updated_user = self.repository.update_user(user_id, update_data)
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
            
        return updated_user

    def delete_user(self, user_id: int):
        success = self.repository.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")