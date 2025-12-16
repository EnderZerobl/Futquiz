import sys
import os
from datetime import date

# 1. Configuração de Path
sys.path.append(os.getcwd())

# 2. Imports do Projeto
# Precisamos importar o engine e o Base para criar as tabelas
from shared.database import SessionLocal, Base, engine
# Precisamos importar o modelo User para que o Base saiba que ele existe
from auth.model import User
from shared.security import get_password_hash

def create_admin_user():
    print("🛠️  Inicializando configuração do banco de dados...")
    
    # --- CRIAÇÃO DO BANCO E TABELAS ---
    # Isso cria o arquivo .db (se for SQLite) e as tabelas se elas não existirem.
    # Se já existirem, ele não faz nada (não apaga dados).
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas verificadas/criadas com sucesso.")
    # ----------------------------------

    db = SessionLocal()
    
    try:
        # --- DADOS DO ADMIN ---
        name = "Admin"
        last_name = "Superuser"
        email = "admin@futquiz.com"
        password = "Mm040511*"
        cpf = "999.999.999-99" # CPF fictício para evitar conflito com reais
        birth_date = date(2000, 1, 1)
        # ----------------------

        print(f"🔍 Verificando usuário {email}...")
        
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            print(f"⚠️  O usuário {email} já existe (ID: {existing_user.id}).")
            
            changed = False
            # Garante que é admin
            if not existing_user.is_admin:
                existing_user.is_admin = True
                changed = True
                print("   -> Promovido a Admin.")

            # Opcional: sempre reseta a senha para garantir acesso em ambiente de dev
            # Se preferir perguntar, descomente o input. Aqui vou forçar para facilitar.
            new_hash = get_password_hash(password)
            if existing_user.password_hash != new_hash: # Verifica se a senha mudou (apenas conceitual, pois hash muda sempre)
                # Na prática, apenas atualizamos:
                existing_user.password_hash = new_hash
                changed = True
                print(f"   -> Senha redefinida para {password}.")

            if changed:
                db.commit()
                print("✅ Atualizações salvas.")
            else:
                print("   -> Nenhuma alteração necessária.")
                
            return

        print("🔨 Criando novo Administrador...")
        
        hashed_password = get_password_hash(password)

        new_user = User(
            name=name,
            last_name=last_name,
            cpf=cpf,
            birth_date=birth_date,
            email=email,
            password_hash=hashed_password,
            is_admin=True 
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print("\n" + "="*40)
        print("🚀 ADMIN CRIADO E PRONTO PARA USO")
        print("="*40)
        print(f"👤 Nome:  {name} {last_name}")
        print(f"📧 Email: {email}")
        print(f"🔑 Senha: {password}")
        print(f"🛡️ Admin: Sim")
        print("="*40)

    except Exception as e:
        print(f"❌ Erro crítico: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()