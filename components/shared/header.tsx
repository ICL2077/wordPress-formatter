import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './container';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return (
        <header className={cn('bg-blue-500 w-full', className)}>
            <Container className="py-3 flex justify-between flex-col gap-1 text-white">
                <h1>WordPress formatter</h1>
            </Container>
        </header>
    );
};
