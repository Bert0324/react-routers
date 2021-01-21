import React, { createContext, FC, memo, useContext, useMemo } from 'react';
import { IRefObj } from '../type/type';

const createStore = (): IRefObj => ({
    stack: [],
    isReplace: false,
    map: {},
    originalTitle: document.title || '',
    actives: {},
    deactives: {},
    matched: []
});
const Context = createContext<IRefObj | null>(null);
export const useRefContext = () => useContext(Context);
export const Provider: FC = memo(({ children }) => {
    const store = useMemo(() => createStore(), []);
    return (
        <Context.Provider value={store}>
            {children}
        </Context.Provider>
    )
});