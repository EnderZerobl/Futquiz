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

