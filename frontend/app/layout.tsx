import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/shared/header';

const nunitoFont = Nunito({
    subsets: ['cyrillic'],
    variable: '--font-nunito',
    weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: 'WordPress formatter',
    description: 'Сайт для форматирования word-файлов в html',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${nunitoFont.variable} ${nunitoFont.variable} antialiased`}>
                <main className="min-h-screen">
                    <Header />
                    {children}
                </main>
            </body>
        </html>
    );
}
