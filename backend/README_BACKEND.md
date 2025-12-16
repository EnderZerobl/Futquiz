Siga estes passos para configurar e iniciar o servidor.

### 1.1. Pré-requisitos

    Python 3.8+

    Git

### 1.2. Configuração

Execute os comandos a seguir no terminal, a partir do diretório raiz do projeto (/futquiz/).

    Crie e Ative o Ambiente Virtual:

    python3 -m venv .venv
    source .venv/bin/activate

Instale as Dependências:

    pip install -r requirements.txt

Limpeza de DB (Apenas na Primeira Execução/Mudança de Schema): Se você fez mudanças nos modelos (UserTable, PerguntaTable) após a primeira execução, delete o arquivo de banco de dados antigo para que a tabela seja recriada corretamente com as novas colunas:
Bash

    rm backend/futquiz.db

### 1.3. Execução

    python3 -m uvicorn main:app --reload

    Verifique: O servidor estará rodando em: http://127.0.0.1:8000.

### 2. Rotas da API (Swagger UI)

Acesse a documentação interativa (Swagger UI) para testar as rotas: http://127.0.0.1:8000/docs

Rotas de Autenticação (REQ 01 & REQ 09)

POST	/auth/register. REQ 09: Cria um novo usuário. Requer 8 caracteres na senha e validação de 18 anos de idade.
POST	/auth/login. REQ 01: Autentica o usuário com email e senha, retornando o token JWT.

Rotas de Questões (REQ 03 & REQ 04)

POST	/perguntas/create. REQ 03: Cadastra uma nova pergunta (Atualmente sem autorização ADM).
GET	/perguntas/list.	REQ 04: Retorna a lista completa de perguntas cadastradas.
