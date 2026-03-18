# WP Admin Assistant API

Бэкенд-сервис на базе Flask, предоставляющий инструменты для автоматизации работы администратора WordPress. Основная функция на данный момент — конвертация документов `.docx` в готовые HTML-блоки Gutenberg.

API настроен с учетом CORS, что позволяет без проблем делать прямые запросы из клиентских компонентов современного фронтенда (например, Next.js).




### Инструкция по запуску (Back-end)

1.  **Остановите и удалите старый контейнер** (если он запущен или остался в системе):
    ```bash
    docker rm -f wp-backend
    ```

2.  **Соберите образ заново** (после ваших правок в `Dockerfile` или коде):
    ```bash
    docker build -t wp-formatter-backend .
    ```

3.  **Запустите свежий контейнер**:
    ```bash
    docker run -p 5001:5001 --name wp-backend wp-formatter-backend
    ```

---

### Полезные флаги (на будущее)
* `-d` — запустить в фоне (чтобы терминал не висел).
* `--rm` — автоматически удалить контейнер после его остановки.
* `docker logs -f wp-backend` — смотреть логи, если запустили в фоне.


## ⚙️ Базовая конфигурация

- **Базовый URL (локально):** `http://localhost:5001`
- **CORS:** Включен глобально для всех маршрутов.
- **Ограничения:** Максимальный размер загружаемого файла — **10 MB**.

---

## 🛣️ Эндпоинты API

### 1. Проверка состояния сервера (Health Check)
Используется для мониторинга доступности бэкенда.

- **URL:** `/health`
- **Метод:** `GET`

**Пример успешного ответа (200 OK):**
```json
{
  "status": "ok",
  "message": "WP Admin Assistant API is running"
}

```

---

### 2. Конвертер Word в блоки WP

Загружает `.docx` файл и возвращает преобразованную HTML-разметку, готовую для вставки в редактор WordPress.

* **URL:** `/api/tools/doc-to-blocks/`
* **Метод:** `POST`
* **Content-Type:** `multipart/form-data`

#### Параметры запроса:

| Поле | Тип | Обязательное | Описание |
| --- | --- | --- | --- |
| `file` | `binary (.docx)` | Да | Файл документа Word для конвертации |

#### Ответы:

**Успешная конвертация (200 OK):**

```json
{
  "html": "<h2>Заголовок документа</h2><p>Преобразованный текст абзаца...</p>"
}

```

**Ошибка валидации (400 Bad Request):**

```json
{
  "error": "No file provided"
}

```

---

## 💻 Интеграция с Next.js

Поскольку во Flask уже настроен `flask_cors`, самый эффективный способ отправки файлов из Next.js — делать запрос напрямую из клиентского компонента (Client Component). Это избавляет от необходимости проксировать тяжелые файлы через встроенные API-роуты Next.js.

### Пример клиентского компонента для загрузки файла

Ниже представлен готовый компонент на React/Next.js (с использованием Tailwind CSS для базовой стилизации), который реализует выбор файла, отправку его на Flask API и отображение полученного HTML.

```tsx
'use client';

import { useState } from 'react';

export default function DocConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlResult, setHtmlResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Обработчик выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл .docx');
      return;
    }

    // Проверка размера файла на стороне клиента (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Размер файла превышает лимит в 10MB');
      return;
    }

    setIsLoading(true);
    setError('');
    setHtmlResult('');

    // Создаем объект FormData для отправки файла
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Запрос к Flask API
      const response = await fetch('http://localhost:5001/api/tools/doc-to-blocks/', {
        method: 'POST',
        // ВАЖНО: При отправке FormData браузер сам установит правильный 
        // Content-Type с нужным boundary, вручную его указывать не нужно!
        body: formData, 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка при конвертации');
      }

      // Сохраняем полученный HTML
      setHtmlResult(data.html);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Конвертер Word в WordPress Blocks</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Выберите .docx файл (макс. 10MB)
          </label>
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Конвертация...' : 'Конвертировать'}
        </button>
      </form>

      {/* Отображение ошибок */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Отображение результата */}
      {htmlResult && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Готовый HTML-код:</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {htmlResult}
            </pre>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(htmlResult)}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Скопировать код
          </button>
        </div>
      )}
    </div>
  );
}

```

### 💡 Важные моменты при работе с Next.js:

1. **Заголовки запроса:** Обрати внимание, что при использовании `fetch` с `FormData`, заголовки `Content-Type` указывать **нельзя**. Браузер должен сам сгенерировать заголовок вида `multipart/form-data; boundary=----WebKitFormBoundary...`. Если задать его вручную, Flask не сможет правильно прочитать файл.
2. **Лимит размера:** В коде Next.js добавлена проверка размера файла (10MB) до отправки запроса. Это позволяет избежать лишней нагрузки на сеть и дублирует защиту из `app.config['MAX_CONTENT_LENGTH']` во Flask.

