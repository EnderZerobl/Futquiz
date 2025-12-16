import sys
import os

# --- CORREÇÃO DO CAMINHO ---
# Adiciona o diretório atual ao sistema para que ele encontre a pasta 'shared'
sys.path.append(os.getcwd())
# ---------------------------

from backend.shared.notification_service import send_topic_push, initialize_firebase
import logging

# Configura log para vermos o que acontece
logging.basicConfig(level=logging.INFO)

print("--- INICIANDO TESTE DE FIREBASE ---")

# 1. Tenta inicializar (vai ler o arquivo .json)
try:
    initialize_firebase()
    print("✅ Inicialização: OK")
except Exception as e:
    print(f"❌ Inicialização: FALHOU - {e}")
    # Se falhar aqui, verifique se o arquivo shared/notification_service.py existe mesmo
    exit()

# 2. Tenta enviar uma mensagem de teste para o tópico
print("\n--- TENTANDO ENVIAR MENSAGEM ---")
try:
    # Dados fictícios
    response = send_topic_push(
        topic="new_quizzes",
        title="Teste de Integração",
        body="Se você recebeu isso, o Backend está conectado ao Firebase!",
        data={"teste": "true", "origem": "script_python"}
    )
    
    if response:
        print(f"\n✅ SUCESSO! O Google aceitou a mensagem.")
        print(f"🆔 ID da Mensagem: {response}")
        print("Isso significa que o backend está configurado corretamente.")
    else:
        print("\n⚠️ AVISO: A função rodou, mas não retornou ID. Verifique se o arquivo firebase_credentials.json está na raiz.")

except Exception as e:
    print(f"\n❌ ERRO FATAL NO ENVIO: {e}")

print("\n--- FIM DO TESTE ---")