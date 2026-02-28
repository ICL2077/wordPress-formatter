'use client';

import { useState } from 'react';
import { Container } from '@/components/shared/container';
import { useDropzone } from 'react-dropzone';
import * as mammoth from 'mammoth';

// @ts-expect-error библиотека не имеет типов TS поэтому на время поставлю игнорирование
import { toHtml } from 'docshift';

export default function HomePage() {
    const [converted, setConverted] = useState<string>();

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: async (files) => {
            const file = files[0];

            const html = await toHtml(file);
            setConverted(html);
        },
    });

    return (
        <Container className="flex h-[90vh] gap-3 flex-row py-5">
            <div
                className="flex items-center p-10 border border-dashed rounded-sm border-gray-400"
                {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Перетащите сюда файл (.docx) или Нажмите для того чтобы передать файл</p>
            </div>
            <div className="w-full h-fit rounded-sm bg-gray-100 p-3">
                <h4 className="mb-5">Отформатированный текст:</h4>
                <ul>{converted}</ul>
            </div>
        </Container>
    );
}
