import React, { createContext, FC, useContext } from 'react';
import { IRefObj } from '../type/type';

const store: IRefObj = {
    stack: [],
    isReplace: false,
    map: {},
    originalTitle: document.title || '',
    actives: {},
    deactives: {}
};
const Context = createContext(store);
export const useRefContext = () => useContext(Context);
export const Provider: FC = ({ children }) => {
    return (
        <Context.Provider value={store}>
            {children}
        </Context.Provider>
    )
}