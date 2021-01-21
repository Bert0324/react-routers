import { FC, CSSProperties, ComponentType } from 'react';

export type IBeforeRoute = (from: string, to: string) => boolean | undefined | void | Promise<boolean | undefined | void>;
export type IAfterRoute = (from: string, to: string) => void;

/**
 * Router Configuration
 * the path in children will be jointed with the path in parent
 */
export interface IPageRouter {
    /**
     * route path
     */
    path: string;
    /**
     * document.title, if not set, will use original title in html
     */
    name?: string;
    /**
     * the lazy load Component
     */
    Component?: () => (Promise<ComponentType<any>> | ComponentType<any>);
    /**
     * children configuration
     */
    children?: IPageRouter[];
    /**
     * triggered before entering route
     * - if return false, deny to enter route\
     * - after `beforeEach`
     */
    beforeRoute?: IBeforeRoute;
    /**
     * triggered after entering route
     * - if return false, deny to enter route
     * - ahead of `afterEach`
     */
    afterRoute?: IAfterRoute;
    /**
     * maintains component state and avoids repeated re-rendering for the route
     * - default is `false`
     * - its priority is higher than `keepAlive` in props
     */
    keepAlive?: boolean;
}

/**
 * `react-routers` props
 */
export interface IRouterProps {
    /**
     * routers config
     */
    routers: IPageRouter[]; 
    /**
     * A fallback react tree to show when a Suspense child (like React.lazy) suspends, and before entering the route
     */
    fallback?: ComponentType<{ from: string; to: string }>;
    /**
     * redirect path
     */
    redirect?: string;
    /**
     * css style
     */
    style?: CSSProperties;
    /**
     * triggered before entering route
     * - if return false, deny to enter route
     * - ahead of any `beforeRoute`
     */
    beforeEach?: IBeforeRoute;
    /**
     * triggered after entering route
     * - if return false, deny to enter route
     * - after any `afterRoute`
     */
    afterEach?: IAfterRoute;
    /**
     * do maintains component state and avoids repeated re-rendering for each route
     * - default is `false`
     */
    keepAlive?: boolean;
    /**
     * switch
     *  - default is `true`
     */
    switchRoute?: boolean;
}

declare module 'react-routers' {
    /**
     * `react-routers`, see document or demo in: 
     * - <https://github.com/Bert0324/react-routers>
     */
    const Routers: FC<IRouterProps>;
    /**
     * triggered when first entering route and every time active it
     */
    const useActive: () => void;
    /**
     * triggered every time unmount route
     */
    const useDeActive: () => void;
    export { Routers, useActive, useDeActive };
}