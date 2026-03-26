"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Container } from "@/components/shared/container";
import OutsideClickHandler from "react-outside-click-handler";
import { cn } from "@/lib/utils";
import { usePostFileMutation } from "@/redux/scriptApi";

export default function HomePage() {
  const [htmlString, setHtmlString] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const [postFile, { isLoading, isError, error: postFileError }] =
    usePostFileMutation();

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

      setError(null);
      setCopied(false);

      const formData = new FormData();
      formData.append("file", file);

      const response = await postFile(formData).unwrap();

      if (isError) {
        throw new Error(`${postFileError}` || "Ошибка API");
      }

      if (!response.html) {
        throw new Error("API не вернул html");
      }

      setHtmlString(response.html);
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
    <Container className="flex h-[90vh] gap-5 flex-row py-5  max-[1030px]:flex-col max-[1030px]:px-3">
      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={`flex items-center justify-center p-10 border-2 border-dashed rounded cursor-pointer transition
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"}`}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Отпустите файл здесь...</p>
        ) : (
          <p>Перетащите .docx файл или кликните</p>
        )}
      </div>

      {/* RESULT */}
      <div className="w-full h-full flex flex-col rounded bg-gray-100 p-5">
        <div className="flex justify-between items-center mb-3 max-[1030px]:flex-col max-[1030px]:gap-3">
          <div className="flex-col">
            <h4 className="font-bold">
              {Boolean(htmlString)
                ? `Вот ваши спарсенные данные!`
                : `Тут будут ваши спарсенные данные!`}
            </h4>

            {!htmlString && !error && !isLoading && !postFileError && (
              <p className="text-gray-500">Скиньте уже что-нибудь!</p>
            )}
          </div>

          <div className="flex flex-row gap-3 items-center max-[1030px]:flex-col">
            <div className="relative flex items-center justify-center">
              <OutsideClickHandler onOutsideClick={() => setIsOpened(false)}>
                <button
                  onClick={() => setIsOpened(true)}
                  className="px-3 py-1 bg-black text-white rounded text-sm"
                >
                  Шаблон
                </button>
              </OutsideClickHandler>

              <div
                className={cn(
                  "flex flex-col gap-3 absolute transition-all duration-200 translate-y-3 opacity-0 top-8 h-fit w-75 border border-black bg-white z-30 rounded-md px-1 py-2 overflow-hidden",
                  isOpened && "opacity-100 translate-y-0",
                )}
              >
                <p className="select-none">
                  Вы можете скачать файл-шаблон для того чтобы увидеть как
                  примерно должен выглядеть входной файл для корректной работы
                </p>
                <a
                  href="/шаблон-файл.docx"
                  download={"../шаблон-файл.docx"}
                  className={cn(
                    "pointer-events-none text-center w-[50%] cursor-pointer px-3 py-1 bg-black text-white rounded text-sm",
                    isOpened && "pointer-events-auto",
                  )}
                >
                  Скачать шаблон
                </a>
              </div>
            </div>

            {htmlString && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-black text-white rounded text-sm"
              >
                {copied ? "Скопировано!" : "Копировать"}
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        {isLoading ? (
          <h1 className="m-auto">Загрузка...</h1>
        ) : (
          htmlString && (
            <textarea
              readOnly
              value={htmlString}
              className="w-full h-full p-3 font-mono text-sm bg-white border rounded resize-none"
            />
          )
        )}
      </div>
    </Container>
  );
}
