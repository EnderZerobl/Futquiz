.PHONY: help up up-attach up-logs down build restart logs frontend-logs backend-logs attach-frontend

HOST_IP := $(shell hostname -I | awk '{print $$1}')
ifeq ($(HOST_IP),)
  HOST_IP := $(shell ip route get 8.8.8.8 2>/dev/null | awk '{print $$7; exit}' || echo "localhost")
endif

help:
	@echo "Comandos disponíveis:"
	@echo "  make up              - Inicia os containers em modo detached"
	@echo "  make up-logs         - Inicia os containers e mostra logs"
	@echo "  make up-attach       - Inicia os containers em modo interativo"
	@echo "  make down            - Para os containers"
	@echo "  make build           - Faz build dos containers"
	@echo "  make restart         - Reinicia os containers"
	@echo "  make logs            - Mostra logs de todos os serviços"
	@echo "  make frontend-logs   - Mostra logs do frontend"
	@echo "  make backend-logs    - Mostra logs do backend"
	@echo "  make attach-frontend - Anexa ao terminal do frontend (interativo)"
	@echo ""
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

