'use client';

import { store } from '@/redux/store';
import React from 'react';
import { Provider } from 'react-redux';

interface Props {
    children: React.ReactNode;
}

export const StoreProvider: React.FC<Props> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};
