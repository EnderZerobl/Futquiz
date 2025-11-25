import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from shared.database import get_db, SessionLocal, UserTable, engine
from auth.interfaces.IAuthRepository import IAuthRepository
from auth.model import User

@pytest.fixture
def db_session_mock(mocker):
    """Mocka a função get_db no main.py para retornar uma Sessão Mockada."""
    mock_session = mocker.Mock(spec=Session)
    mocker.patch("main.get_db", return_value=iter([mock_session]))
    mocker.patch("shared.database.get_db", return_value=iter([mock_session]))
    return mock_session

@pytest.fixture
def mock_auth_repository(mocker):
    """Cria um mock da interface IAuthRepository para testes unitários."""
    mock_repo = mocker.Mock(spec=IAuthRepository)
    return mock_repo

@pytest.fixture(scope="function", autouse=True)
def real_db_session_cleanup():
    """
    Garante que a tabela 'users' seja limpa após cada teste de integração que a utiliza,
    evitando 409 CONFLICTs.
    """
    db = SessionLocal()
    try:
        db.query(UserTable).delete()
        db.commit()
        yield 
    finally:
        db.rollback() 
        db.close()
