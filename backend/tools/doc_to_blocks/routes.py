from flask import Blueprint, request, jsonify
from .service import convert_doc_to_wp_tags # Импорт логики

# Создаем чертеж модуля
doc_to_blocks_bp = Blueprint('doc_to_blocks', __name__)


@doc_to_blocks_bp.route('/', methods=['POST'])
def handle_conversion():
    # Проверка наличия файла в запросе
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    # Вызываем тяжелую логику из service.py
    result = convert_doc_to_wp_tags(file)

    return jsonify({"html": result}), 200