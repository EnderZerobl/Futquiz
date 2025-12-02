import pytest
from fastapi.testclient import TestClient
from main import app
from fastapi import status, HTTPException
from auth.schemas.user_schema import UserView
from datetime import date

# --- CORREÇÃO AQUI: Importar oauth2_scheme de auth.dependencies ---
# É aqui que a sua aplicação define e usa a segurança, então é aqui que devemos mockar.
from auth.dependencies import get_current_admin, get_current_user_payload, oauth2_scheme

client = TestClient(app)

# --- DADOS DE EXEMPLO ---
QUESTION_DATA = {
    "texto": "Teste de ADM",
    "opcoes": ["A", "B"],
    "indice_opcao_correta": 0,
    "tempo_quiz_segundos": 20
}

# Simulando um usuário admin retornado pelo banco
ADMIN_USER_VIEW = UserView(
    id=1, 
    email="admin@mock.com", 
    name="Mock", 
    last_name="Admin", 
    cpf="00000000001", 
    birth_date=date(1990, 1, 1), 
    is_admin=True
)

# --- FIXTURES INTELIGENTES ---

@pytest.fixture(autouse=True)
def manage_overrides():
    """
    Salva os overrides originais (definidos no main.py) antes do teste
    e os restaura depois. Isso impede que o teste quebre a Injeção de Dependência.
    """
    original_overrides = app.dependency_overrides.copy()
    yield
    app.dependency_overrides = original_overrides

@pytest.fixture
def override_token_validation():
    """
    Sobrescreve o oauth2_scheme e o payload para ignorar validação de token.
    """
    # Ignora a validação do formato do token
    app.dependency_overrides[oauth2_scheme] = lambda: "token_fake_valido"
    
    # Ignora a decodificação do token (evita erro de assinatura inválida)
    app.dependency_overrides[get_current_user_payload] = lambda: {
        "sub": "mock_user",
        "user_id": 1,
        "is_admin": False 
    }

# --- TESTES DE FLUXO ---

def test_create_question_requires_authentication():
    """Deve falhar com 401 se NENHUM token for fornecido."""
    # Sem overrides, usa a lógica real -> Falha por falta de token
    response = client.post("/perguntas/create", json=QUESTION_DATA)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Not authenticated" in response.json()["detail"]

def test_create_question_denies_non_admin(override_token_validation):
    """Deve falhar com 403 Forbidden (Usuário logado, mas sem permissão)."""
    
    # 1. Simulamos o 'porteiro' do admin barrando a entrada
    def fake_admin_check_denied():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acesso negado. Requer privilégios de administrador."
        )
    
    # 2. Aplicamos o override na dependência de ADMIN
    app.dependency_overrides[get_current_admin] = fake_admin_check_denied
    
    # 3. Fazemos a requisição enviando o header (que será aceito pelo override do token)
    response = client.post(
        "/perguntas/create", 
        json=QUESTION_DATA,
        headers={"Authorization": "Bearer token_fake_valido"}
    )
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "privilégios de administrador" in response.json()["detail"]

def test_create_question_allows_admin(override_token_validation, mocker):
    """Deve permitir o acesso e retornar 201 (Usuário é Admin)."""
    
    # 1. Mockamos o serviço de criar pergunta (para não usar o banco)
    mocker.patch(
        "questions.service.PerguntaService.PerguntaService.criar_pergunta", 
        return_value=mocker.MagicMock(id=1, texto="Mocked Question")
    )
    
    # 2. Simulamos o 'porteiro' do admin deixando passar
    app.dependency_overrides[get_current_admin] = lambda: ADMIN_USER_VIEW
    
    response = client.post(
        "/perguntas/create", 
        json=QUESTION_DATA,
        headers={"Authorization": "Bearer token_fake_valido"}
    )
    
    assert response.status_code == status.HTTP_201_CREATED