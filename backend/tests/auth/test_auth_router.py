import pytest
from fastapi.testclient import TestClient
from main import app
from fastapi import status
from datetime import date, timedelta
import json

client = TestClient(app)

TEST_USER_DATA = {
    "email": "integration@test.com",
    "password": "SenhaSeguraTeste1",
    "name": "Integracao",
    "last_name": "Testes",
    "cpf": "11122233344",
    "birth_date": str(date.today() - timedelta(days=20*365.25)),
    "is_admin": False
}

def test_register_user_success():
    response = client.post("/auth/register", json=TEST_USER_DATA)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["email"] == TEST_USER_DATA["email"]
    assert "password_hash" not in data

def test_register_user_password_too_short():
    invalid_data = TEST_USER_DATA.copy()
    invalid_data["email"] = "shortpass@test.com"
    invalid_data["password"] = "abc"
    
    response = client.post("/auth/register", json=invalid_data)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "8 caracteres" in response.json()["detail"]

def test_register_user_duplicate_email():
    response = client.post("/auth/register", json=TEST_USER_DATA)
    
    assert response.status_code == status.HTTP_409_CONFLICT
    assert "Email ou CPF já registrado" in response.json()["detail"]

def test_login_success():
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
    login_data = {
        "email": TEST_USER_DATA["email"],
        "password": "SenhaErrada"
    }
    response = client.post("/auth/login", json=login_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Credenciais inválidas" in response.json()["detail"]

def test_login_user_not_found():
    login_data = {
        "email": "naoexiste@test.com",
        "password": "qualquer"
    }
    response = client.post("/auth/login", json=login_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Credenciais inválidas" in response.json()["detail"]