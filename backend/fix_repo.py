import os

code = r"""from sqlalchemy.orm import Session
from shared.database import PerguntaTable
from questions.schemas.PerguntaInputModel import PerguntaInputModel
import json

class PerguntaRepository:
    def __init__(self, db: Session):
        self.db = db

    def salvar_pergunta(self, dados: PerguntaInputModel):
        # Converte a lista de strings para uma String JSON para salvar no banco
        opcoes_str = json.dumps(dados.opcoes)

        # Mapeamento EXATO conforme seu shared/database.py
        nova_pergunta_db = PerguntaTable(
            texto=dados.texto,                                 # Coluna 'texto'
            opcoes_json=opcoes_str,                            # Coluna 'opcoes'
            indice_opcao_correta=dados.indice_opcao_correta,   # Coluna 'indice_opcao_correta'
            tempo_quiz_segundos=dados.tempo_quiz_segundos      # Coluna 'tempo_quiz_segundos'
        )
        
        # O banco não tem colunas 'nivel' ou 'resposta_correta' (string), 
        # então NÃO passamos elas aqui.

        self.db.add(nova_pergunta_db)
        self.db.commit()
        self.db.refresh(nova_pergunta_db)
        
        # Como o ViewModel pode esperar 'id', 'texto', etc, retornamos o objeto do banco
        # que o Pydantic vai tentar converter.
        return nova_pergunta_db

    def listar_perguntas(self):
        return self.db.query(PerguntaTable).all()

    def get_dashboard_metrics(self):
        return {}
"""

path = "questions/repository/PerguntaRepository.py"
with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print(f"✅ Arquivo {path} atualizado para bater com shared/database.py!")