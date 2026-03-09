from docx import Document
def convert_doc_to_wp_tags(file):
    """
    Данная функция просто возвращает количество символов в документе докх
    """
    try:
        doc = Document(file)

        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)

        content = "\n".join(full_text)

        # Считаем символы
        total_chars_with_spaces = len(content)
        total_chars_no_spaces = len(content.replace(" ", "").replace("\n", "").replace("\r", ""))


        return f" количество символов с пробелами - {total_chars_with_spaces}, Количество символов без пробелов - {total_chars_no_spaces}"
    except Exception as e:
        return f"Ошибка при чтении документа: {str(e)}"
