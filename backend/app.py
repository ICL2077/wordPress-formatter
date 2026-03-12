from flask import Flask
from flask_cors import CORS
from flasgger import Swagger

from tools.doc_to_blocks.routes import doc_to_blocks_bp



def create_app():
    app = Flask(__name__)

    # Разрешаем запросы с фронтенда (важно для работы с Next.js)
    CORS(app)

    app.config['SWAGGER'] = {
        'title': 'WP Admin Assistant API',
        'uiversion': 3,  # Используем современный интерфейс Swagger UI
        'openapi': '3.0.0'
    }
    # Инициализируем Swagger
    swagger = Swagger(app)

    # Настройки (можно вынести в config.py)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Лимит 16MB на загрузку файлов

    # Регистрация инструментов как отдельных веток API
    # url_prefix делает эндпоинты аккуратными: /api/tools/doc-to-blocks/...
    app.register_blueprint(doc_to_blocks_bp, url_prefix='/api/tools/doc-to-blocks')

    @app.route('/health')
    def health_check():
        return {"status": "ok", "message": "WP Admin Assistant API is running"}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)