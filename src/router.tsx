import React, { lazy, Suspense, FC, memo, useState, useMemo, useEffect, useRef } from 'react';
import { matchPath } from 'react-router';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import { IPageRouter, IRouterProps, IBeforeRoute, IAfterRoute } from '../index.d';

interface IRefObj {
    historyChangeHandler?: () => void;
    stack: string[];
    isReplace: boolean;
    originalTitle: string;
    map: {
        [path: string]: {
            name: string;
            beforeRoute: IBeforeRoute;
            afterRoute: IAfterRoute;
        }
    }
}

/**
 * router
 */
const Router: FC<IRouterProps> = memo(({ routers, fallback, redirect, beforeEach, afterEach }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const ref = useRef<IRefObj>({
        stack: [],
        isReplace: false,
        map: {},
        originalTitle: document.title || ''
    });

    const paths = useMemo(() => {
        ref.current.map = {};
        /**
         * config path
         * @param params 
         */
        const Page = (params: IPageRouter) => {
            if (!params.Component) return false;
            const Component = lazy(async () => ({ default: withRouter(await params.Component!()) }));
            ref.current.map[params.path] = {
                name: params.name,
                beforeRoute: params.beforeRoute,
                afterRoute: params.afterRoute
            };
            return <Route exact path={params.path} key={params.path} component={() => <Component />} />;
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
    
    ref.current.historyChangeHandler = () => {
        setLoading(true);
        const from = ref.current.stack[ref.current.stack.length - 1] || '';
        // wait for redirect
        setTimeout(async () => {
            const notEnterHandler = () => {
                ref.current.isReplace = true;
                history.replace(from);
                setLoading(false);
            };
            const to = history.location.pathname;
            if ((await beforeEach?.(from, to)) === false) return notEnterHandler();

            const config = ref.current.map[Object.keys(ref.current.map)?.find(key => matchPath(to, {
                path: key,
                exact: true
            }))];

            if ((await config?.beforeRoute?.(from, to)) === false) return notEnterHandler();
            ref.current.stack.push(to);
            setLoading(false);
            document.title = config?.name || ref.current.originalTitle;
            await config?.afterRoute?.(from, to);
            afterEach?.(from, to);
        });
    };

    useEffect(() => {
        ref.current?.historyChangeHandler?.();
        history.listen(async () => {
            if (!ref.current.isReplace) {
                ref.current?.historyChangeHandler?.();
            } else {
                ref.current.isReplace = false;
            }
        });
    }, []);

    const Loading = useMemo(() => {
        const Fallback = fallback;
        if (!Fallback) return <></>;
        return (
            <Fallback 
                from={ref.current.stack[ref.current.stack.length - 1] || ''} 
                to={history.location.pathname} 
            />
        );
    }, [fallback, ref.current.stack[ref.current.stack.length - 1], history.location.pathname]);

    return (
        <Suspense fallback={Loading}>
            {loading ? Loading : 
            <Switch>
                {paths}
                {!!redirect && <Redirect to={redirect} />}
            </Switch>}
        </Suspense>
    );
});

export const Routers: FC<IRouterProps> = memo((props) => (
    <div style={props.style}>
       <Router {...props} />
    </div>
));
