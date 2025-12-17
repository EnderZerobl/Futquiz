# ⚽ FutQuiz - Aplicação Gamificada de Quizes

Este repositório contém o código completo para a aplicação *FutQuiz*, desenvolvida com foco rigoroso em **SOLID** e arquitetura baseada em serviços de domínio (FastAPI/React Native).

## 💡 Status e Requisitos Implementados

Esta entrega cobre os requisitos essenciais de Segurança, Autenticação e a base de Conteúdo, demonstrando a aplicação dos princípios SOLID.

| REQ | Domínio | Descrição da Funcionalidade | Status |
| :---: | :--- | :--- | :--- |
| **REQ 01** | Manter Usuário | Implementação da inclusão (cadastro) e consulta de usuários, servindo como base para autenticação e controle de acesso. | COMPLETO |
| **REQ 02** | Recuperação de Senha | Funcionalidade de recuperação de senha para permitir o acesso do usuário ao sistema. | COMPLETO |
| **REQ 03** | Cadastrar Time | CRUD completo no domínio teams, essencial para categorização e filtragem das perguntas do quiz. | COMPLETO |
| **REQ 04** | Cadastrar Perguntas | Criação de perguntas por meio de endpoint restrito a usuários com privilégios de Administrador, com validação das alternativas. | COMPLETO |
| **REQ 05** | Cadastrar Respostas | Registro e validação das respostas dos jogadores, com verificação da alternativa correta integrada à lógica do quiz. | COMPLETO |
| **REQ 06** | Disputar Quiz | Funcionalidade que permite a participação do jogador na disputa do quiz. | COMPLETO |
| **REQ 07** | Encerrar Quiz | Controle de tempo de resposta por pergunta através do campo tempo\_quiz\_segundos, permitindo o encerramento da partida. | COMPLETO |
| **REQ 08** | Ranking da Partida | Visualização do ranking por partida com base na pontuação obtida pelos jogadores. | COMPLETO |
| **REQ 09** | Autenticação | Login, validação de credenciais e emissão de JSON Web Tokens (JWT) para proteger rotas da aplicação. | COMPLETO |
| **REQ 10** | Logout | Implementação da saída do sistema com invalidação do token JWT. | COMPLETO |
| **REQ 12** | Dashboard de Questões | Geração de métricas das perguntas, incluindo taxa média de acertos por meio de agregações SQL. | COMPLETO |
| **REQ 13** | Jogador Mais Rápido | Identificação do jogador mais rápido com base no menor tempo total de resposta. | COMPLETO |
| **REQ 14** | Ranking Geral | Criação do ranking geral de jogadores utilizando soma de pontuação e quantidade de partidas disputadas. | COMPLETO |
| **REQ 17** | Notificação | Notificação aos usuários quando um novo quiz é adicionado ao sistema. | COMPLETO |

---
<br>
Design: https://www.figma.com/design/dx0fZXecEh3uSSABIMAKsD/Soccer-Quiz-Design-NOVO?node-id=12-649&m=dev&t=5eBNh1UMcUhohvMA-1

## 🚀 Como rodar o projeto pela primeira vez

1. Certifique-se de ter Docker e Docker Compose instalados

2. Clone o repositório e entre na pasta do projeto

3. Execute o build e inicie os containers:
```bash
make build

make up-logs
```

## 📚 Documentação da API (Swagger)

Acesse a documentação interativa da API em:
- **URL:** http://localhost:8000/docs


## 📱 Como rodar o app via Expo Go

1. Certifique-se de que os containers estão rodando:
```bash
make up
```

2. Uma vez no app, escaneie o QRCode ou digite o link, que aparecem no terminal

2. Em outro terminal, execute o comando para interagir com o frontend:
```bash
make attach-frontend
```

3. Quando aparecer o prompt do Expo, digite a seta para baixo e selecione a opção **"Proceed Anonymously"**

5. O app será carregado no seu dispositivo

**Importante:** Para sair do terminal de interação sem parar o container, pressione `Ctrl+P` seguido de `Ctrl+Q` (não use `Ctrl+C`, pois isso para todos os containers).

