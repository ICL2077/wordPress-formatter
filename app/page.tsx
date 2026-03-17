"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "@/components/shared/container";

export default function HomePage() {
  const [htmlString, setHtmlString] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file) {
        setError("Файл не выбран");
        return;
      }

      setLoading(true);
      setError(null);
      setCopied(false);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "http://localhost:5001/api/tools/doc-to-blocks/",
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Ошибка API");
        }

        const data = await response.json();

        if (!data.html) {
          throw new Error("API не вернул html");
        }

        setHtmlString(data.html);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlString);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
    }
  };

  return (
    <Container className="flex h-[90vh] gap-5 flex-row py-5">
      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={`flex items-center justify-center p-10 border-2 border-dashed rounded cursor-pointer transition
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"}`}
      >
        <input {...getInputProps()} />

        {loading ? (
          <p>Загрузка...</p>
        ) : isDragActive ? (
          <p>Отпустите файл здесь...</p>
        ) : (
          <p>Перетащите .docx файл или кликните</p>
        )}
      </div>

      {/* RESULT */}
      <div className="w-full h-full flex flex-col rounded bg-gray-100 p-5">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold">HTML (для копирования):</h4>

          {htmlString && (
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-black text-white rounded text-sm"
            >
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        {!htmlString && !error && !loading && (
          <p className="text-gray-500">Здесь появится HTML</p>
        )}

        {htmlString && (
          <textarea
            readOnly
            value={htmlString}
            className="w-full h-full p-3 font-mono text-sm bg-white border rounded resize-none"
          />
        )}
      </div>
    </Container>
  );
}
