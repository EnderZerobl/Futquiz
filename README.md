# ⚽ FutQuiz - Aplicação Gamificada de Quizes

Este repositório contém o código completo para a aplicação *FutQuiz*, desenvolvida com foco rigoroso em **SOLID** e arquitetura baseada em serviços de domínio (FastAPI/React Native).

## 💡 Status e Requisitos Implementados

Esta entrega cobre os requisitos essenciais de Segurança, Autenticação e a base de Conteúdo, demonstrando a aplicação dos princípios SOLID.

| REQ | Domínio | Descrição da Funcionalidade | Status |
| :---: | :--- | :--- | :--- |
| **REQ 01** | Manter Usuário | Implementação da Inclusão (Cadastro) e Consulta de usuários (base para o CRUD completo). | COMPLETO |
| **REQ 09** | Autenticação | Login, validação de credenciais e emissão de JSON Web Tokens (JWT) para proteger rotas. | COMPLETO |
| **REQ 04** | Questões | Criação de Perguntas: Implementação do endpoint restrito a usuários com privilégios de Administrador. | COMPLETO |
| **REQ 10** | Logout | Implementação da saída do sistema (destruição da sessão/token). | COMPLETO |
| **REQ 07** | Quiz | Controle de Tempo de Resposta: Entidade Pergunta inclui o campo tempo\_quiz\_segundos, estabelecendo a fundação da lógica de tempo de jogo. | COMPLETO |

---

## 🚀 Setup e Execução (Docker Compose)

O projeto utiliza **Docker** para garantir um ambiente de desenvolvimento consistente e a fácil portabilidade do Backend (FastAPI) e Frontend (React Native/Expo).

### Pré-requisitos

* **Docker**
* **Docker Compose**
* Link do Design: [https://www.figma.com/design/bf74THL929V4aUCebkVzXZ/App.-Eng-Software?node-id=0-1&t=pr5BtIwzgbrJ7b2X-1](https://www.fignma.com/design/bf74THL929V4aUCebkVzXZ/App.-Eng-Software?node-id=0-1&t=pr5BtIwzgbrJ7b2X-1)

### 1. Inicialização do Projeto

Execute os comandos a seguir na pasta raiz do repositório para construir as imagens e iniciar os contêineres:

```bash
# 1. Executa o build das imagens e inicia os containers em segundo plano
make build

make up-logs
``` 

O Backend FastAPI será iniciado no contêiner e estará acessível pelo Frontend.

2. Interagindo com o Frontend (Expo)

O Frontend (React Native) roda em um contêiner Docker com o Expo/Metro Bundler. Para escanear o QR code e rodar o app no seu dispositivo físico ou simulador, você precisa interagir com o terminal do Frontend:
Bash

# Entra no terminal do container do Frontend para acessar o Metro Bundler
make attach-frontend

O terminal exibirá o QR Code do Expo. Use o aplicativo Expo Go no seu celular para escanear o código e iniciar o aplicativo.

    Importante: Para sair do terminal de interação sem parar o contêiner, pressione Ctrl+P seguido de Ctrl+Q (NÃO use Ctrl+C).

🌐 Testes e Arquitetura

1. Documentação Interativa (Swagger UI)

O Backend FastAPI gera automaticamente a documentação interativa para teste de todos os endpoints:

Acesse em seu navegador: http://127.0.0.1:8000/docs

2. Design e Estrutura

A estrutura de Microsserviços e a aplicação dos princípios SOLID (SRP, DIP) no Backend são comprovadas pela suíte de testes unitários.
