.PHONY: help up up-attach up-logs up-tunnel down build restart logs frontend-logs backend-logs attach-frontend

IS_WSL := $(shell grep -qEi "(Microsoft|WSL)" /proc/version 2>/dev/null && echo "true" || echo "false")

ifeq ($(IS_WSL),true)
  HOST_IP := $(shell powershell.exe -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi' -ErrorAction SilentlyContinue).IPAddress" 2>/dev/null | tr -d '\r\n')
  ifeq ($(HOST_IP),)
    HOST_IP := $(shell powershell.exe -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Ethernet' -ErrorAction SilentlyContinue).IPAddress" 2>/dev/null | tr -d '\r\n')
  endif
  ifeq ($(HOST_IP),)
    HOST_IP := $(shell ip route show | grep -i default | awk '{print $$3}' 2>/dev/null)
  endif
else
  HOST_IP := $(shell hostname -I | awk '{print $$1}')
endif

ifeq ($(HOST_IP),)
  HOST_IP := $(shell ip route get 8.8.8.8 2>/dev/null | awk '{print $$7; exit}' || echo "localhost")
endif

help:
	@echo "Comandos disponíveis:"
	@echo "  make up              - Inicia os containers em modo detached"
	@echo "  make up-logs         - Inicia os containers e mostra logs"
	@echo "  make up-attach       - Inicia os containers em modo interativo"
	@echo "  make up-tunnel       - Inicia os containers com tunnel (ngrok)"
	@echo "  make down            - Para os containers"
	@echo "  make build           - Faz build dos containers"
	@echo "  make restart         - Reinicia os containers"
	@echo "  make logs            - Mostra logs de todos os serviços"
	@echo "  make frontend-logs   - Mostra logs do frontend"
	@echo "  make backend-logs    - Mostra logs do backend"
	@echo "  make attach-frontend - Anexa ao terminal do frontend (interativo)"
	@echo ""
	@if [ "$(IS_WSL)" = "true" ]; then \
		echo "🔍 WSL detectado - usando IP do Windows host"; \
	fi
	@echo "IP do host detectado: $(HOST_IP)"

up:
	@echo "🔗 Usando IP do host: $(HOST_IP)"
	HOST_IP=$(HOST_IP) docker compose up -d

up-logs:
	@echo "🔗 Usando IP do host: $(HOST_IP)"
	HOST_IP=$(HOST_IP) docker compose up -d
	@sleep 2
	docker compose logs -f

up-attach:
	@echo "🔗 Usando IP do host: $(HOST_IP)"
	HOST_IP=$(HOST_IP) docker compose up

up-tunnel:
	@echo "🌐 Iniciando com tunnel (ngrok)..."
	USE_TUNNEL=true HOST_IP=$(HOST_IP) docker compose up -d
	@sleep 2
	docker compose logs -f frontend

down:
	docker compose down

build:
	@echo "🔗 Usando IP do host: $(HOST_IP)"
	HOST_IP=$(HOST_IP) docker compose build

restart:
	docker compose restart

logs:
	docker compose logs -f

frontend-logs:
	docker compose logs -f frontend

backend-logs:
	docker compose logs -f backend

attach-frontend:
	docker attach futquiz-frontend
