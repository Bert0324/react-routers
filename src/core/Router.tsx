import React, { lazy, Suspense, FC, memo, useState, useMemo, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Route, withRouter } from 'react-router';
import { throttle } from 'lodash-es';
import { IRouterProps, IPageRouter } from '../../index.d';
import { Provider, useRefContext } from '../context/context';
import { findMatchRoute } from '../utils/utils';
import { KeepAlive } from './KeepAlive';

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

    const paths = useMemo(() => {
        data.map = {};
        /**
         * config path
         * @param params 
         */
        const Page = (params: IPageRouter) => {
            if (!params.Component) return false;
            let alive = false;
            if (keepAlive !== undefined) alive = keepAlive;
            if (params.keepAlive !== undefined) alive = params.keepAlive;

            data.map[params.path] = {
                name: params.name || '',
                beforeRoute: params.beforeRoute,
                afterRoute: params.afterRoute,
                alive,
                selfMatched: [],
                path: params.path,
                switchRoute: !!switchRoute,
                transition: params.transition || transition,
                delay: delayLoad,
                haveBeforeEach: !!beforeEach,
                ready: false
            };
    
            const waitForComponent = async () => {
                const component = await params.Component!();
                setTimeout(() => data.map[params.path].ready = true);
                return component;
            };
            const Component = lazy(async () => ({ default: withRouter(await waitForComponent()) }));
            return (
                <Route path='*' key={params.path}>
                    <KeepAlive path={params.path}>
                        <Component />
                    </KeepAlive>
                </Route>
            );
        };
    
        /**
         * joint path
         * @param acc 
         * @param crr 
         * @param rootPath 
         */
        const createPage = (acc: JSX.Element[], crr: IPageRouter, rootPath?: string, rootParams?: IPageRouter) => {
            crr.path = (rootPath || '') + crr.path;
            const page = Page({ ...rootParams, ...crr });
            if (page) acc.push(page);
            crr.children?.forEach?.((child) => createPage(acc, child, crr.path, { ...rootParams, ...crr }));
            return acc;
        };
        return routers.reduce<JSX.Element[]>((acc, crr) => createPage(acc, crr), []);
    }, [keepAlive, routers, switchRoute]);

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

