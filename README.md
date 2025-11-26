# Futquiz

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


