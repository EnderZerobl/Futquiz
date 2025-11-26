import pytest
from sqlalchemy.orm import Session
from questions.repository.PerguntaRepository import PerguntaRepository
from questions.schemas.PerguntaInputModel import PerguntaInputModel
from questions.schemas.PerguntaViewModel import PerguntaViewModel
from shared.database import PerguntaTable
import json

TEST_INPUT = PerguntaInputModel(
    texto="Teste de Persistência",
    opcoes=["A", "B", "C"],
    indice_opcao_correta=0,
    tempo_quiz_segundos=15
)

@pytest.fixture
def pergunta_repo(db_session_mock: Session):
    """Cria uma instância do PerguntaRepository injetando o mock de sessão."""
    return PerguntaRepository(db=db_session_mock)

# --- Testes de CRUD (Persistência) ---

def test_salvar_pergunta_success(pergunta_repo, db_session_mock, mocker):
    """Deve criar a pergunta no DB e retornar o ViewModel correto."""
    
    mock_db_object = mocker.MagicMock(
        id=1,
        texto=TEST_INPUT.texto,
        opcoes_json=json.dumps(TEST_INPUT.opcoes),
        indice_opcao_correta=TEST_INPUT.indice_opcao_correta,
        tempo_quiz_segundos=TEST_INPUT.tempo_quiz_segundos
    )
    
    db_session_mock.refresh.side_effect = lambda obj: setattr(obj, 'id', 1)
    
    result = pergunta_repo.salvar_pergunta(TEST_INPUT)
    
    db_session_mock.add.assert_called_once()
    db_session_mock.commit.assert_called_once()
    assert result.id == 1
    assert result.texto == TEST_INPUT.texto
    assert isinstance(result.opcoes, list)

def test_listar_perguntas_success(pergunta_repo, db_session_mock, mocker):
    """Deve listar perguntas e converter corretamente o JSON de opções."""
    
    mock_db_object = mocker.MagicMock(
        id=2,
        texto="Pergunta Mock",
        opcoes_json=json.dumps(["Sim", "Não"]),
        tempo_quiz_segundos=30
    )

    db_session_mock.query.return_value.all.return_value = [mock_db_object]
    
    result = pergunta_repo.listar_perguntas()
    
    assert len(result) == 1
    assert result[0].id == 2
    assert result[0].opcoes == ["Sim", "Não"] 