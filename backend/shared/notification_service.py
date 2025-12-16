import firebase_admin
from firebase_admin import credentials, messaging
import os
import logging

# Configuração de Logs simples para vermos no terminal
logger = logging.getLogger("uvicorn")

# NOME DO ARQUIVO QUE VOCÊ VAI BAIXAR DO FIREBASE
# Coloque este arquivo na raiz do projeto (junto com main.py)
CRED_PATH = "firebase_credentials.json"

def initialize_firebase():
    """
    Inicializa o SDK do Firebase Admin se ainda não estiver ativo.
    Verifica se o arquivo de credenciais existe para evitar erros se você ainda não baixou.
    """
    try:
        # Verifica se já existe uma instância rodando para não inicializar duas vezes
        if not firebase_admin._apps:
            if os.path.exists(CRED_PATH):
                cred = credentials.Certificate(CRED_PATH)
                firebase_admin.initialize_app(cred)
                logger.info("✅ Firebase Admin inicializado com sucesso.")
            else:
                logger.warning(f"⚠️  Arquivo '{CRED_PATH}' não encontrado. Push Notifications não serão enviadas.")
    except Exception as e:
        logger.error(f"❌ Erro ao inicializar Firebase: {e}")

def send_topic_push(topic: str, title: str, body: str, data: dict = None):
    """
    Envia uma notificação Push para todos os dispositivos inscritos em um tópico.
    Ex: topic='new_quizzes'
    """
    # Garante que está inicializado antes de tentar enviar
    initialize_firebase()
    
    # Se falhou ao inicializar (ex: sem arquivo json), retorna sem quebrar o app
    if not firebase_admin._apps:
        print("LOG: Firebase não configurado. Pulei o envio do Push.")
        return

    try:
        # O Firebase exige que os valores dentro de 'data' sejam strings
        data_payload = {k: str(v) for k, v in data.items()} if data else {}

        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data_payload,
            topic=topic,
        )

        # Envia a mensagem
        response = messaging.send(message)
        logger.info(f"🚀 Push enviado para o tópico '{topic}'. ID: {response}")
        return response
    except Exception as e:
        logger.error(f"❌ Falha ao enviar Push Notification: {e}")
        return None