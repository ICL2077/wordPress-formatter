FROM python:3.14-slim

RUN addgroup --system appgroup && adduser --system --group appuser

WORKDIR /app

# Создаем папку для временных файлов заранее
RUN mkdir -p /app/temp && chown -R appuser:appgroup /app/temp

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R appuser:appgroup /app

USER appuser

ENV PYTHONPATH="/app:/app/"
EXPOSE 5001

CMD ["gunicorn", \
  "--bind", "0.0.0.0:5001", \
  "--workers", "2", \
  "--threads", "4", \
  "--timeout", "120", \
  "--graceful-timeout", "30", \
  "--access-logfile", "-", \
  "--error-logfile", "-", \
  "app:create_app()"]