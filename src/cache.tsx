import React, { FC, MutableRefObject } from 'react';
import { IRefObj } from './type.d';
import { findMatchRoute } from './utils';

export const KeepAlive: FC<{ currentRef: MutableRefObject<IRefObj>; pathKey: string }> = ({ children, currentRef, pathKey }) => {
    const config = findMatchRoute(currentRef.current.map, pathKey);
    if (config && !config.node) {
        setTimeout(() => {
            config.node = children;
        });
    }
    return (
        <>
            {config?.node || children}
        </>
    );
}