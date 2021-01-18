import React, { lazy, Suspense, FC, memo, useState, useMemo, useEffect, useRef } from 'react';
import { Switch, Route, Redirect, withRouter, useHistory } from 'react-router-dom';
import { LoadingPage } from './loading';
import { IPageRouter, IRouterProps } from '../index.d';

/**
 * config path
 * @param params 
 */
const Page = (params: IPageRouter) => {
    if (!params.Component) return false;
    const Component = lazy(async () => ({ default: withRouter(await params.Component!()) }));
    return <Route exact path={params.path} key={params.name} component={() => <Component />} />;
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

const stack: string[] = [];
let isReplace = false;
/**
 * router
 */
const Router: FC<IRouterProps> = memo(({ routers, fallbackPage, loadingPage, redirect, beforeEach, afterEach }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const paths = useMemo(() => routers.reduce<JSX.Element[]>((acc, crr) => createPage(acc, crr), []), [routers]);
    const ref = useRef<Function>();

    ref.current = () => {
        setLoading(true);
        const from = stack[stack.length - 1] || '';
        // redirect
        setTimeout(async () => {
            const to = history.location.pathname;
            const go = await beforeEach?.(from, to);
            if (go !== false) {
                stack.push(to);
                afterEach?.(from, to);
            } else {
                isReplace = true;
                history.replace(from);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        ref.current?.();
        history.listen(async () => {
            if (!isReplace) {
                ref.current?.();
            } else {
                isReplace = false;
            }
        });
    }, []);

    return (
        <Suspense fallback={fallbackPage || <LoadingPage />}>
            {loading ? (loadingPage || <LoadingPage />) : <Switch>
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
