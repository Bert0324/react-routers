import React, { lazy, Suspense, FC, memo, useState, useMemo, useEffect } from 'react';
import { Route, withRouter, useHistory } from 'react-router-dom';
import { IPageRouter, IRouterProps } from '../../index.d';
import { Provider, useRefContext } from '../context/context';
import { KeepAlive } from './KeepAlive';
import { findMatchRoute } from '../utils/utils';

/**
 * router
 */
const Router: FC<IRouterProps> = memo(({ routers, fallback, redirect, beforeEach, afterEach, style, keepAlive }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const data = useRefContext();

    const Loading = useMemo(() => {
        const Fallback = fallback;
        if (!Fallback) return <></>;
        return (
            <Fallback 
                from={data.stack[data.stack.length - 1] || ''} 
                to={history.location.pathname} 
            />
        );
    }, [fallback]);

    const paths = useMemo(() => {
        data.map = {};
        /**
         * config path
         * @param params 
         */
        const Page = (params: IPageRouter) => {
            if (!params.Component) return false;
            const Component = lazy(async () => ({ default: withRouter(await params.Component!()) }));
            data.map[params.path] = {
                name: params.name,
                beforeRoute: params.beforeRoute,
                afterRoute: params.afterRoute
            };
            let alive = false;
            if (keepAlive !== undefined) alive = keepAlive;
            if (params.keepAlive !== undefined) alive = params.keepAlive;
            return (
                <Route path='*' key={params.path}>
                    <KeepAlive path={params.path} alive={alive}>
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
    }, [routers]);
    
    data.historyChangeHandler = () => {
        setLoading(true);
        const from = data.stack[data.stack.length - 1] || '';
        // wait for redirect
        setTimeout(async () => {
            const notEnterHandler = () => {
                data.isReplace = true;
                history.replace(from);
                setLoading(false);
            };
            const to = history.location.pathname;

            const config = findMatchRoute(data.map, to);
            if (!config) return history.push(redirect);

            if ((await beforeEach?.(from, to)) === false) return notEnterHandler();
            if ((await config?.beforeRoute?.(from, to)) === false) return notEnterHandler();
            data.stack.push(to);
            setLoading(false);
            document.title = config?.name || data.originalTitle;
            await config?.afterRoute?.(from, to);
            afterEach?.(from, to);
        });
    };

    useEffect(() => {
        data.historyChangeHandler?.();
        history.listen(async () => {
            if (!data.isReplace) {
                data.historyChangeHandler?.();
            } else {
                data.isReplace = false;
            }
        });
    }, []);

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

export const Routers: FC<IRouterProps> = (props) => (
    <Provider>
        <Router {...props} />
    </Provider>
)

