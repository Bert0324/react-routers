import React, { lazy, useMemo } from 'react';
import { Route, withRouter } from 'react-router';
import { useRefContext } from 'react-routers';
import { IBeforeRoute, IPageRouter, ITransition } from '../../index.d';
import { KeepAlive } from './KeepAlive';

export const usePaths = (routers: IPageRouter[], keepAlive?: boolean, switchRoute?: boolean, transition?: ITransition, delay?: number, beforeEach?: IBeforeRoute) => {
    const data = useRefContext();
    const delayLoad = delay || 100;
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
                switchRoute,
                transition: params.transition || transition,
                delay: delayLoad,
                haveBeforeEach: !!beforeEach,
                ready: false
            };
    
            const waitForComponent = async () => {
                const asyncTask = () => new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
                await asyncTask();
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

    return paths;
};

