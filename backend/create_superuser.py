import os
from shared.database import SessionLocal, engine, Base 
from auth.model import User
from shared.security import get_password_hash

DB_FILE = "futquiz.db"

# 1. GARANTIR QUE NÃO EXISTE ARQUIVO VELHO
if os.path.exists(DB_FILE):
    try:
        os.remove(DB_FILE)
        print(f"🗑️  Banco antigo {DB_FILE} apagado.")
    except PermissionError:
        print(f"⚠️  ERRO: Não foi possível apagar {DB_FILE}.")
        exit(1)

# 2. CRIAR TABELAS DO ZERO
print("🔨 Criando novas tabelas...")
Base.metadata.create_all(bind=engine)

db = SessionLocal()

email = "admin@futquiz.com"
senha = "admin"

print(f"👤 Criando superusuário: {email} ...")

new_admin = User(
    email=email,
    name="Super Admin",
    password_hash=get_password_hash(senha),
    is_admin=True 
)

db.add(new_admin)
db.commit()
print("✅ SUCESSO! Admin criado e sistema pronto.")

db.close()