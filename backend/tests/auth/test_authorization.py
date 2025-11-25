import pytest
from fastapi.testclient import TestClient
from main import app
from fastapi import status
from unittest.mock import MagicMock

client = TestClient(app)

QUESTION_DATA = {
    "texto": "Teste de ADM",
    "opcoes": ["A", "B"],
    "indice_opcao_correta": 0,
    "tempo_quiz_segundos": 20
}

@pytest.fixture
def mock_admin_user_dependency(mocker):
    mock_user_view = mocker.MagicMock()
    mocker.patch(
        "auth.service.AuthService.get_current_admin", 
        return_value=mock_user_view
    )

@pytest.fixture
def mock_non_admin_permission(mocker):
    from fastapi import HTTPException
    mocker.patch(
        "auth.service.AuthService.get_current_admin", 
        side_effect=HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acesso negado. Requer privilégios de administrador."
        )
    )

def test_create_question_requires_authentication():
    response = client.post("/perguntas/create", json=QUESTION_DATA)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Not authenticated" in response.json()["detail"]

def test_create_question_denies_non_admin(mock_non_admin_permission):
    fake_token_header = {"Authorization": "Bearer fake.token.here"}
    
    response = client.post("/perguntas/create", headers=fake_token_header, json=QUESTION_DATA)
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "privilégios de administrador" in response.json()["detail"]

def test_create_question_allows_admin(mock_admin_user_dependency, mocker):
    mocker.patch(
        "questions.service.PerguntaService.PerguntaService.criar_pergunta", 
        return_value=mocker.MagicMock(id=1, texto="Mocked Question")
    )
    
    admin_header = {"Authorization": "Bearer valid.admin.token"}

    response = client.post("/perguntas/create", headers=admin_header, json=QUESTION_DATA)
    
    assert response.status_code == status.HTTP_201_CREATED