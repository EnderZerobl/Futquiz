import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Session
from shared.database import get_db
from auth.interfaces.IAuthRepository import IAuthRepository

@pytest.fixture(scope="session")
def db_session_mock(mocker):
    mock_session = mocker.Mock(spec=Session)
    mocker.patch("main.get_db", return_value=iter([mock_session]))
    return mock_session

@pytest.fixture
def mock_auth_repository(mocker):
    mock_repo = mocker.Mock(spec=IAuthRepository)
    return mock_repo