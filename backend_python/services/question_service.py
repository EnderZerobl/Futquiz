from app.core.protocols import QuestionRepositoryProtocol # DIP: Recebe a abstração
from app.core.models.pydantic_models import QuestionCreateSchema, TeamCreateSchema # Schemas do Magno

class QuestionService:
    # DIP: A Injeção de Dependência garante que a implementação (QuestionRepository)
    # seja recebida aqui de forma transparente.
    def __init__(self, repository: QuestionRepositoryProtocol):
        self.repository = repository

    # Lógica para criar uma nova pergunta
    def create_new_question(self, question_data: QuestionCreateSchema):
        # **Lógica de Negócio / Validação:**
        # 1. Validar se há pelo menos uma resposta correta.
        correct_answers = [a for a in question_data.answers if a.is_correct]
        if not correct_answers:
            raise ValueError("Uma pergunta deve ter pelo menos uma resposta correta.")
            
        # 2. Convertendo Pydantic em modelo SQL
        # (Essa conversão deve ser feita aqui ou no router, dependendo da convenção da equipe)
        
        # Chama a abstração do repositório, sem saber se é SQLite, Postgres ou Mock.
        new_question_sql = self.repository.save(
            question=question_data.to_sql_model(), # Exemplo de conversão
            answers=question_data.answers_to_sql_model(),
            teams=[]
        )
        return new_question_sql

    # REQ 04: Lógica para listar perguntas
    def get_questions_list(self, skip: int, limit: int):
        return self.repository.list_questions(skip, limit)