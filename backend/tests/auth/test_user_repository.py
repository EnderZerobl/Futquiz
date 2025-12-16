import pytest
from datetime import date
from sqlalchemy.orm import Session
from auth.repository.UserRepository import UserRepository
from auth.schemas.user_schema import UserEntity, UserUpdateInput
from shared.database import UserTable 

TEST_USER_DATA = {
    "id": 1,
    "email": "test@repo.com",
    "password_hash": "hashed_pass",
    "name": "Repo",
    "last_name": "User",
    "cpf": "11122233344",
    "birth_date": date(1990, 1, 1),
    "is_admin": True
}

@pytest.fixture
def user_repo(db_session_mock: Session):
    return UserRepository(session=db_session_mock)

def test_list_all_users(user_repo, db_session_mock):
    mock_users = [UserTable(**TEST_USER_DATA)]
    db_session_mock.query.return_value.all.return_value = mock_users
    
    users = user_repo.list_all_users()
    
    assert len(users) == 1
    assert users[0].email == "test@repo.com"

def test_create_user_success(user_repo, db_session_mock, mocker):
    db_session_mock.commit.return_value = None
    
    new_user_instance = mocker.MagicMock(spec=UserTable, **TEST_USER_DATA)
    new_user_instance.id = 1
    
    db_session_mock.refresh.side_effect = lambda user: setattr(user, 'id', 1)

    result = user_repo.create_user(TEST_USER_DATA)
    
    db_session_mock.add.assert_called_once()
    db_session_mock.commit.assert_called_once()
    assert result.id == 1

def test_update_user_success(user_repo, db_session_mock, mocker):
    existing_user = mocker.MagicMock(spec=UserTable, **TEST_USER_DATA)
    db_session_mock.query.return_value.filter.return_value.first.return_value = existing_user

    update_data = {'name': 'NovoNome'}
    
    user_repo.update_user(user_id=1, update_data=update_data)
    
    assert existing_user.name == 'NovoNome'
    db_session_mock.commit.assert_called_once()

def test_delete_user_success(user_repo, db_session_mock, mocker):
    existing_user = mocker.MagicMock(spec=UserTable, **TEST_USER_DATA)
    db_session_mock.query.return_value.filter.return_value.first.return_value = existing_user

    result = user_repo.delete_user(user_id=1)
    
    db_session_mock.delete.assert_called_once_with(existing_user)
    db_session_mock.commit.assert_called_once()
    assert result is True