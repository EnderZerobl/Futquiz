import pytest
from fastapi.testclient import TestClient
from main import app
from fastapi import status
from datetime import date, timedelta
import json

client = TestClient(app)

# Dados base para teste de integração
TEST_USER_DATA = {
    "email": "integration@test.com",
    "password": "SenhaSeguraTeste1",
    "name": "Integracao",
    "last_name": "Testes",
    "cpf": "11122233344",
    "birth_date": str(date.today() - timedelta(days=20*365.25)),
    "is_admin": False
}

# --- Testes do Router (Rotas Públicas) ---

def test_register_user_success():
    """Testa o cadastro bem-sucedido (201 Created)."""
    # O DB está limpo (graças ao autouse=True no conftest)
    response = client.post("/auth/register", json=TEST_USER_DATA)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["email"] == TEST_USER_DATA["email"]

def test_register_user_duplicate_email():
    """
    Testa a falha de unicidade (409 Conflict).
    Cria um usuário válido e depois tenta criar outro igual.
    """
    # 1. Cria um usuário válido no ambiente limpo
    client.post("/auth/register", json=TEST_USER_DATA)
    
    # 2. Tenta registrar o mesmo usuário (deve falhar)
    response = client.post("/auth/register", json=TEST_USER_DATA)
    
    assert response.status_code == status.HTTP_409_CONFLICT
    # CORREÇÃO: Asserção contra a mensagem exata do Repositório
    assert "Este email já está registrado." in response.json()["detail"]

def test_login_success():
    """Testa o login bem-sucedido (200 OK)."""
    # Pré-condição: Cria o usuário no ambiente limpo do teste
    client.post("/auth/register", json=TEST_USER_DATA)
    
    login_data = {
        "email": TEST_USER_DATA["email"],
        "password": TEST_USER_DATA["password"]
    }
    response = client.post("/auth/login", json=login_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
def test_login_invalid_password():
    """Testa a falha no login por senha incorreta (401 Unauthorized)."""
    # Pré-condição: Cria o usuário no ambiente limpo
    client.post("/auth/register", json=TEST_USER_DATA) 
    
    login_data = {
        "email": TEST_USER_DATA["email"],
        "password": "SenhaErrada"
    }
    response = client.post("/auth/login", json=login_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Credenciais inválidas" in response.json()["detail"]

def test_register_user_password_too_short():
    """Testa a falha na validação de senha (400 Bad Request)."""
    invalid_data = TEST_USER_DATA.copy()
    invalid_data["email"] = "shortpass@test.com"
    invalid_data["password"] = "abc"
    
    response = client.post("/auth/register", json=invalid_data)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "8 caracteres" in response.json()["detail"]