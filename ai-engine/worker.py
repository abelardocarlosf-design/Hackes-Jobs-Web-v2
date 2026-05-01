import os
from celery import Celery

# Configuración del Message Broker (Redis)
# En Docker-compose el hostname será 'redis'
redis_url = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')

celery_app = Celery(
    'ai_tasks',
    broker=redis_url,
    backend=redis_url,
    include=['nlp_pipeline'] # Archivo donde estarán las tareas
)

# Configuraciones adicionales
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    # Limitar tareas por worker para evitar OOM (Out Of Memory) en AWS
    worker_max_tasks_per_child=50,
)

if __name__ == '__main__':
    celery_app.start()
