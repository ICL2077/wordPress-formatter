'use client';

import { useState } from 'react';
import { Container } from '@/components/shared/container';
import { useDropzone } from 'react-dropzone';
import * as mammoth from 'mammoth';

export default function HomePage() {
    const [htmlString, setHtmlString] = useState<string>();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (files) => {
            const file = files[0];

            const arrBuff = await file.arrayBuffer();

            const res = await mammoth.convertToHtml({ arrayBuffer: arrBuff });

            setHtmlString(res.value);
        },
    });

    const parseTables = (arr: string[]) => {
        if (typeof window === 'undefined') return [];

        const parser = new DOMParser();
        const arrOfTags: { row: string; blocks: string[] }[] = [];

        arr.forEach((str) => {
            const parseString = parser.parseFromString(str, 'text/html');
            const tableRows = parseString.querySelectorAll('table tr');

            tableRows.forEach((row) => {
                const tds = row.querySelectorAll('td');
                const blocks: string[] = [];

                tds.forEach((td) => {
                    blocks.push(td.innerHTML);
                });

                if (blocks.length > 0) arrOfTags.push({ row: row.innerHTML, blocks });
            });
        });

        return arrOfTags;
    };

    const convertP = (htmlStr: string) => {
        if (htmlStr.includes('<p>'))
            return `<!-- wp:paragraph -->\n${htmlStr}\n<!-- /wp:paragraph -->`.split('\n');

        return htmlStr;
    };

    const arrOfTables = htmlString?.split('</table>').map((str) => str + '</table>') ?? [];

    const rows = parseTables(arrOfTables);

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
                <div className="flex flex-col gap-5">
                    {rows.map((itm, index) => (
                        <>
                            <ul className="border-b border-black" key={index}>
                                <h1>Строка: {index + 1}</h1>
                                {itm.blocks.map((block, index) => {
                                    const gutenString = convertP(block);
                                    console.log(gutenString);

                                    if (typeof gutenString === 'string') {
                                        return <li key={index}>{gutenString}</li>;
                                    } else {
                                        return (
                                            <li className="my-3" key={index}>
                                                {gutenString.map((str, index) => (
                                                    <p key={index}>{str}</p>
                                                ))}
                                            </li>
                                        );
                                    }
                                })}
                            </ul>
                        </>
                    ))}
                </div>
            </div>
        </Container>
    );
}
