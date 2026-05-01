# Build stage
FROM python:3.10-slim as builder

WORKDIR /app

# Instalar dependencias del sistema requeridas para construir paquetes de Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Production stage
FROM python:3.10-slim

WORKDIR /app

# Copiar wheels desde la etapa de build e instalar
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

RUN pip install --no-cache /wheels/*

# Copiar el código fuente de la aplicación AI Engine
COPY . .

# Generar el cliente Prisma en el entorno de Docker (requiere el schema)
# Asegurarse de que el schema fue copiado (se recomienda tenerlo en ai-engine/schema.prisma)
# RUN prisma generate

# Exponer el puerto de FastAPI
EXPOSE 8000

# Añadir un usuario no-root por seguridad corporativa
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Comando de inicio usando Uvicorn (servidor ASGI para FastAPI)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
