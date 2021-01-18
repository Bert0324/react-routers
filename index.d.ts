import React, { CSSProperties, ComponentType } from 'react';

export type IBeforeRoute = (from: string, to: string) => boolean | undefined | void | Promise<boolean | undefined | void>;
export type IAfterRoute = (from: string, to: string) => void;

/**
 * Router Configuration
 * the path in children will be jointed with the path in parent
 */
export interface IPageRouter {
    path: string;
    /**
     * document.title
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
     * A fallback react tree to show when a Suspense child (like React.lazy) suspends
     */
    fallbackPage?: ComponentType<any>;
    /**
     * A fallback react tree to show before entering the route
     */
    loadingPage?: ComponentType<any>;
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
}

declare module 'react-routers' {
    /**
     * `react-routers`, see document in: 
     * - <https://github.com/Bert0324/react-routers>
     */
    const Routers: React.FC<IRouterProps>
    export { Routers };
}