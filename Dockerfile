FROM python:3.14-slim

# 1. Создаем системную группу и пользователя без прав root
RUN addgroup --system appgroup && adduser --system --group appuser

WORKDIR /app

# Копируем и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY . .

# 2. Передаем права на файлы нашему непривилегированному пользователю
RUN chown -R appuser:appgroup /app

# 3. Переключаемся на безопасного пользователя
USER appuser

ENV PYTHONPATH="/app:/app/backend"
EXPOSE 5001

# 4. Запускаем Gunicorn с использованием /dev/shm для heartbeats
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "4", "--worker-tmp-dir", "/dev/shm", "--log-level", "info", "backend.app:create_app()"]