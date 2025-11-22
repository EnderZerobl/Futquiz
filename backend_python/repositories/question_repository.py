from sqlalchemy.orm import Session
from app.core.protocols import QuestionRepositoryProtocol # Abstração do Magno
from app.core.models.sql_models import Question, Answer, Team # Modelos SQL do Magno
from typing import List

class QuestionRepository(QuestionRepositoryProtocol):
    def __init__(self, db: Session):
        self.db = db

    # REQ 03: Implementar salvar pergunta/resposta/times
    def save(self, question: Question, answers: List[Answer], teams: List[Team]):
        # Adiciona a pergunta e as respostas
        self.db.add(question)
        self.db.bulk_save_objects(answers)
        
        # Adiciona os times (se necessário) e associa à pergunta
        # Lógica de associação de times (ex: many-to-many)

        self.db.commit()
        self.db.refresh(question)
        return question

    # REQ 04: Implementar listar perguntas (pode ser paginado ou por filtro)
    def list_questions(self, skip: int = 0, limit: int = 100):
        return self.db.query(Question).offset(skip).limit(limit).all()

    # Exemplo extra: buscar por ID
    def get_by_id(self, question_id: int):
        return self.db.query(Question).filter(Question.id == question_id).first()