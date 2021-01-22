import React, { lazy, Suspense, FC, memo, useState, useMemo, useEffect } from 'react';
import { Route, withRouter, useHistory } from 'react-router-dom';
import { IPageRouter, IRouterProps } from '../..';
import { Provider, useRefContext } from '../context/context';
import { KeepAlive } from './KeepAlive';
import { findMatchRoute } from '../utils/utils';

/**
 * router
 */
const Router: FC<IRouterProps> = memo(({ routers, fallback, redirect, beforeEach, afterEach, style, keepAlive, switchRoute = true }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const data = useRefContext()!;

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
            const waitForComponent = async () => {
                const component = await params.Component!();
                return component;
            };
            const Component = lazy(async () => ({ default: withRouter(await waitForComponent()) }));
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
                switchRoute
            };
            return (
                <Route path='*' key={params.path}>
                    <KeepAlive config={data.map[params.path]}>
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
        const createPage = (acc: JSX.Element[], crr: IPageRouter, rootPath?: string) => {
            crr.path = (rootPath || '') + crr.path;
            const page = Page(crr);
            if (page) acc.push(page);
            crr.children?.forEach?.((child) => createPage(acc, child, crr.path));
            return acc;
        };
        return routers.reduce<JSX.Element[]>((acc, crr) => createPage(acc, crr), []);
    }, [JSON.stringify({ keepAlive, routers, switchRoute })]);

    const notEnterHandler = (from: string, redirect?: boolean) => {
        data.isReplace = true && !redirect;
        (redirect ? history.push : history.replace)(from);
        if (!redirect) setLoading(false);
    };
    
    data.historyChangeHandler = async () => {
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

