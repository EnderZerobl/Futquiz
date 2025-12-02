# Integração Frontend-Backend

## Configuração Inicial

### 1. Configurar o IP Local

Para que o app se comunique com o backend local, você precisa configurar o IP da sua máquina no arquivo:

`src/config/api.ts`

**Passos:**

1. Descubra o IP da sua máquina na rede Wi-Fi:
   ```bash
   # Linux/Mac
   ip addr show | grep "inet " | grep -v 127.0.0.1
   # ou
   hostname -I
   
   # Windows
   ipconfig
   # Procure por "IPv4 Address" na sua conexão Wi-Fi
   ```

2. Abra o arquivo `src/config/api.ts` e altere a linha:
   ```typescript
   const LOCAL_IP = '192.168.1.100'; // Mude para seu IP local
   ```

3. Substitua `192.168.1.100` pelo IP que você descobriu.

### 2. Rodar o Backend

Certifique-se de que o backend está rodando e acessível:

```bash
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Importante:** Use `--host 0.0.0.0` para permitir conexões externas na rede local.

### 3. Verificar Conexão

- Certifique-se de que o celular e o computador estão na **mesma rede Wi-Fi**
- Teste acessando `http://SEU_IP:8000/docs` no navegador do celular

## Funcionalidades Implementadas

### Autenticação

- ✅ **Login** (`/auth/login`)
  - Tela: `LoginScreen`
  - Validação de campos
  - Loading state
  - Tratamento de erros

- ✅ **Registro** (`/auth/register`)
  - Tela: `RegisterScreen`
  - Validação de idade (mínimo 16 anos)
  - Validação de senha (mínimo 8 caracteres)
  - Formatação de CPF e data
  - Conversão de data para formato ISO
  - Loading state
  - Tratamento de erros

### Serviços

- ✅ `authService` - Gerencia autenticação
- ✅ `perguntaService` - Gerencia perguntas (pronto para uso)
- ✅ `api` - Cliente HTTP configurado com interceptors

### Contexto

- ✅ `AuthContext` - Gerencia estado de autenticação global
- ✅ Token salvo automaticamente no AsyncStorage
- ✅ Token adicionado automaticamente nas requisições

## Estrutura de Arquivos

```
frontend/src/
├── config/
│   └── api.ts              # Configuração da URL da API
├── services/
│   ├── api.ts              # Cliente HTTP (axios)
│   ├── authService.ts      # Serviço de autenticação
│   └── perguntaService.ts  # Serviço de perguntas
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticação
└── screens/
    └── Auth/
        ├── LoginScreen/
        └── RegisterScreen/
```

## Próximos Passos

Para produção, você precisará:

1. Fazer deploy do backend (Railway, Render, etc.)
2. Atualizar a URL de produção em `src/config/api.ts`
3. Configurar variáveis de ambiente no EAS Build

## Troubleshooting

### Erro de conexão

- Verifique se o backend está rodando
- Verifique se o IP está correto
- Verifique se estão na mesma rede Wi-Fi
- Verifique se o firewall não está bloqueando a porta 8000

### Erro 401 (Não autorizado)

- Token pode ter expirado
- Faça logout e login novamente

### Erro de validação

- Verifique os requisitos de senha (mínimo 8 caracteres)
- Verifique a idade mínima (16 anos)
- Verifique o formato do email

