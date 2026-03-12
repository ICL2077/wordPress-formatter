from docx import Document
def convert_doc_to_wp_tags(file):
    from docx import Document

    document = Document('input.docx')
    table_text = []  # список с таблицей

    for table in document.tables:  # заполнение таблицы
        for row in table.rows:
            text = [cell.text for cell in row.cells]
            table_text.append(text)

    atistation = table_text[-4:-3]
    table_text = table_text[2:-5]  # убираю лишнее

    with open('output.txt', 'wb') as output:
        output.write(bytes('', 'utf-8'))

    with open('output.txt', 'ab') as output:
        sample = open('sample.html', 'rb')
        date_sample_start = sample.read(638)  # переменая с тегами перед текстом с датой
        date_sample_end = sample.read(66)  # переменая с тегами после текста с датой
        main_text_tegs = sample.read(235)

        for row_index in range(len(table_text)):
            time = table_text[row_index][0]
            lecturer = table_text[row_index][3]
            lesson = table_text[row_index][1]

            if lesson[:6] == 'Модуль':
                continue
            elif time == lesson:
                date = table_text[row_index][0]
                print(date[:5])
                output.write(date_sample_start + bytes(date, 'utf-8') + date_sample_end)
                output.write(main_text_tegs)

            else:
                output.write(bytes(time.replace('.', ':') + ', ' + lecturer.split(',')[0], "utf-8"))
                output.write(bytes("<br></strong>" + lesson, "utf-8"))

                if row_index == len(table_text) - 1 or table_text[row_index + 1][0] == table_text[row_index + 1][1] and \
                        table_text[row_index + 1][0][:6] != 'Модуль':
                    output.write(bytes("</p>\n<!-- /wp:paragraph -->\n\n", "utf-8"))

                else:
                    output.write(bytes("<br><strong>", "utf-8"))

        sample.close()
        return output
