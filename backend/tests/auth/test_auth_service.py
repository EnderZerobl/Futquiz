import pytest
from datetime import date
from typing import Dict
from unittest.mock import MagicMock
from fastapi import HTTPException, status
from auth.service.AuthService import AuthService
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.schemas.user_schema import UserInput, UserView, UserEntity

@pytest.fixture
def mock_auth_repository(mocker):
    mock_repo = mocker.Mock(spec=IAuthRepository)
    return mock_repo

@pytest.fixture
def auth_service(mock_auth_repository):
    return AuthService(repository=mock_auth_repository)

VALID_USER_INPUT = UserInput(
    email="test@valid.com",
    password="senhaSegura123",
    name="Nome",
    last_name="Sobrenome",
    cpf="12345678901",
    birth_date=date(2000, 1, 1),
    is_admin=False
)

VALID_USER_VIEW = UserView(
    id=1,
    email="test@valid.com",
    name="Nome",
    last_name="Sobrenome",
    cpf="12345678901",
    birth_date=date(2000, 1, 1),
    is_admin=False
)

def test_register_user_success(auth_service, mock_auth_repository):
    mock_auth_repository.create_user.return_value = VALID_USER_VIEW
    
    result = auth_service.register_user(VALID_USER_INPUT)
    
    mock_auth_repository.create_user.assert_called_once()
    assert result.email == VALID_USER_INPUT.email
    assert result.id == 1

def test_register_user_password_too_short(auth_service):
    invalid_input = VALID_USER_INPUT.model_copy(update={'password': 'short'})
    
    with pytest.raises(ValueError, match="8 caracteres"):
        auth_service.register_user(invalid_input)

def test_register_user_too_young(auth_service):
    invalid_input = VALID_USER_INPUT.model_copy(update={'birth_date': date(2020, 1, 1)})
    
    with pytest.raises(ValueError, match="18 anos"):
        auth_service.register_user(invalid_input)

def test_authenticate_user_success(auth_service, mock_auth_repository, mocker):
    
    mocker.patch('auth.service.AuthService.verify_password', return_value=True)
    mocker.patch('auth.service.AuthService.create_access_token', return_value="FAKE_JWT_TOKEN")
    
    user_entity_with_hash = UserEntity(
        email=VALID_USER_INPUT.email,
        password_hash="hashed_password_mock", 
        name=VALID_USER_INPUT.name,
        last_name=VALID_USER_INPUT.last_name,
        cpf=VALID_USER_INPUT.cpf,
        birth_date=VALID_USER_INPUT.birth_date,
        is_admin=VALID_USER_INPUT.is_admin
    )
    mock_auth_repository.find_by_email.return_value = user_entity_with_hash 

    credentials = {"email": VALID_USER_INPUT.email, "password": "senhaSegura123"}
    
    token = auth_service.authenticate_user(credentials)
    
    assert token == "FAKE_JWT_TOKEN"
    
def test_authenticate_user_not_found(auth_service, mock_auth_repository):
    mock_auth_repository.find_by_email.return_value = None

    credentials = {"email": "naoexiste@teste.com", "password": "qualquer"}
    
    with pytest.raises(HTTPException) as excinfo:
        auth_service.authenticate_user(credentials)
    
    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED