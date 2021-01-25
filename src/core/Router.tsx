import React, { Suspense, FC, memo, useState, useMemo, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { throttle } from 'lodash-es';
import { IRouterProps } from '../../index.d';
import { Provider, useRefContext } from '../context/context';
import { findMatchRoute } from '../utils/utils';
import { usePaths } from './paths';

/**
 * router
 */
const Router: FC<IRouterProps> = memo(({ routers, fallback, redirect, beforeEach, afterEach, style, keepAlive, switchRoute = true, transition, delay }) => {
    const history = useHistory();
    const [loading, _setLoading] = useState(true);
    const data = useRefContext()!;

    const delayLoad = delay || 100;

    const setLoading = useCallback(throttle((_loading: boolean) => {
        _setLoading(_loading);
    }, delayLoad, { leading: false, trailing: true }), [_setLoading]);

    const Loading = useMemo(() => {
        const Fallback = fallback;
        if (!Fallback) return <></>;
        return (
            <Fallback 
                from={data.stack[data.stack.length - 1] || ''} 
                to={history.location.pathname} 
            />
        );
    }, [data.stack, fallback, history.location.pathname]);

    const paths = usePaths(routers, keepAlive, switchRoute, transition, delay, beforeEach);

    const notEnterHandler = (from: string, redirect?: boolean) => {
        data.isReplace = true && !redirect;
        (redirect ? history.push : history.replace)(from);
        if (!redirect) setLoading(false);
    };
    
    data.historyChangeHandler = async () => {
        // don't show loading with an interval
        setLoading(true);
        data.matched = [];
        setTimeout(async () => {

            const to = history.location.pathname;
            
            const config = findMatchRoute(data.map, to);
            if (!config && redirect) return notEnterHandler(redirect, true);
            if (!config && !redirect) {
                return setLoading(false);
            }
                
            const from = data.stack[data.stack.length - 1] || '';
            
            if ((await beforeEach?.(from, to)) === false) return notEnterHandler(from);
            if ((await config.beforeRoute?.(from, to)) === false) return notEnterHandler(from);
            data.stack.push(to);
            setLoading(false);
            document.title = config.name || data.originalTitle;
    
            await config.afterRoute?.(from, to);
            afterEach?.(from, to);
        });
    };

    useEffect(() => {
        data.historyChangeHandler?.();
        history.listen(() => {
            if (!data.isReplace) {
                data.historyChangeHandler?.();
            } else {
                data.isReplace = false;
            }
        });
    }, [data, history]);

    return (
        <div style={style}>
            <Suspense fallback={Loading}>
                {loading ? Loading : null}
                <div style={{ display: loading ? 'none' : '' }}>
                    {paths}
                </div>
            </Suspense>
        </div>
    );
});

export const Routers: FC<IRouterProps> = memo((props) => (
    <Provider>
        <Router {...props} />
    </Provider>
));

