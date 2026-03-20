from io import BytesIO
from pathlib import Path
from docx import Document


def convert_doc_to_wp_tags(file):
    # Переводим входной файл в память
    uploaded_bytes = file.read()
    document = Document(BytesIO(uploaded_bytes))

    table_text = []

    for table in document.tables:
        for row in table.rows:
            text = [cell.text for cell in row.cells]
            table_text.append(text)

    table_text = table_text[2:-5]  # убираю лишнее

    # Читаем sample.html как шаблон
    current_dir = Path(__file__).resolve().parent
    sample_path = current_dir / "sample.html"
    sample_bytes = sample_path.read_bytes()

    # Те же самые куски, что и в исходной функции
    date_sample_start = sample_bytes[:638]
    date_sample_end = sample_bytes[638:704]
    main_text_tegs = sample_bytes[704:939]

    output = BytesIO()

    for row_index in range(len(table_text)):
        time = table_text[row_index][0]
        lecturer = table_text[row_index][3]
        lesson = table_text[row_index][1]

        if lesson[:6] == 'Модуль':
            continue

        elif time == lesson:
            date = table_text[row_index][0]
            output.write(date_sample_start + date.encode("utf-8") + date_sample_end)
            output.write(main_text_tegs)

        else:
            output.write((time.replace('.', ':') + ', ' + lecturer.split(',')[0]).encode("utf-8"))
            output.write(("<br></strong>" + lesson).encode("utf-8"))

            if (
                row_index == len(table_text) - 1
                or (
                    table_text[row_index + 1][0] == table_text[row_index + 1][1]
                    and table_text[row_index + 1][0][:6] != 'Модуль'
                )
            ):
                output.write(b"</p>\n<!-- /wp:paragraph -->\n\n")
            else:
                output.write(b"<br><strong>")

    return output.getvalue().decode("utf-8")