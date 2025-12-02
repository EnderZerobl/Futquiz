import pytest
from typing import List
from fastapi import HTTPException, status
from questions.service.PerguntaService import PerguntaService
from questions.interfaces.IPerguntaRepository import IPerguntaRepository
from questions.schemas.PerguntaInputModel import PerguntaInputModel
from questions.schemas.PerguntaViewModel import PerguntaViewModel



VALID_INPUT = PerguntaInputModel(
    texto="Qual o maior campeão da Copa?",
    opcoes=["Brasil", "Alemanha", "Itália"],
    indice_opcao_correta=0,
    tempo_quiz_segundos=20
)

VALID_VIEW = PerguntaViewModel(
    id=1,
    texto=VALID_INPUT.texto,
    opcoes=VALID_INPUT.opcoes,
    tempo_quiz_segundos=VALID_INPUT.tempo_quiz_segundos
)

@pytest.fixture
def mock_pergunta_repository(mocker):
    """Cria um mock da interface IPerguntaRepository."""
    mock_repo = mocker.Mock(spec=IPerguntaRepository)
    return mock_repo

@pytest.fixture
def pergunta_service(mock_pergunta_repository):
    """Cria uma instância do PerguntaService com o repositório mockado."""
    return PerguntaService(repository=mock_pergunta_repository)

def test_validar_dados_pergunta_success(pergunta_service):
    """Deve aceitar uma pergunta válida sem levantar exceção."""
    try:
        pergunta_service.validar_dados_pergunta(VALID_INPUT)
    except ValueError:
        pytest.fail("Validação falhou inesperadamente para dados válidos.")

def test_validar_dados_pergunta_indice_invalido(pergunta_service):
    """Deve falhar se o índice da resposta correta for inválido."""
    invalid_input = VALID_INPUT.model_copy(update={'indice_opcao_correta': 5}) 
    
    with pytest.raises(ValueError, match="inválido ou está fora do intervalo"):
        pergunta_service.validar_dados_pergunta(invalid_input)

def test_validar_dados_pergunta_poucas_opcoes(pergunta_service):
    """Deve falhar se houver menos de 2 opções."""
    invalid_input = VALID_INPUT.model_copy(update={'opcoes': ['Sim']})
    
    with pytest.raises(ValueError, match="mínimo duas opções"):
        pergunta_service.validar_dados_pergunta(invalid_input)

def test_criar_pergunta_success(pergunta_service, mock_pergunta_repository):
    """Deve criar a pergunta e chamar o repositório."""
    mock_pergunta_repository.salvar_pergunta.return_value = VALID_VIEW
    
    result = pergunta_service.criar_pergunta(VALID_INPUT)
    
    mock_pergunta_repository.salvar_pergunta.assert_called_once()
    assert result.texto == VALID_INPUT.texto

def test_listar_perguntas_success(pergunta_service, mock_pergunta_repository):
    """Deve listar todas as perguntas retornadas pelo repositório."""
    mock_pergunta_repository.listar_perguntas.return_value = [VALID_VIEW]
    
    result = pergunta_service.listar_perguntas()
    
    mock_pergunta_repository.listar_perguntas.assert_called_once()
    assert len(result) == 1
    assert result[0].id == VALID_VIEW.id