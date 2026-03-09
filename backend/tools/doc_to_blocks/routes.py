from flask import Blueprint, request, jsonify
from .service import convert_doc_to_wp_tags # Импорт логики

# Создаем чертеж модуля
doc_to_blocks_bp = Blueprint('doc_to_blocks', __name__)


@doc_to_blocks_bp.route('/', methods=['POST'])
def handle_conversion():
    """
        Конвертер Word в блоки Gutenberg
        ---
        tags:
          - Doc to Blocks Tool
        summary: Загрузка .docx файла для конвертации в HTML-блоки WordPress
        requestBody:
          required: true
          content:
            multipart/form-data:
              schema:
                type: object
                properties:
                  file:
                    type: string
                    format: binary
                    description: Файл формата .docx
        responses:
          200:
            description: Успешная конвертация
            schema:
              type: object
              properties:
                html:
                  type: string
                  example: "<p>Преобразованный текст</p>"
          400:
            description: Ошибка валидации
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No file provided"
        """
    # Проверка наличия файла в запросе
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    # Вызываем тяжелую логику из service.py
    result = convert_doc_to_wp_tags(file)

    return jsonify({"html": result}), 200