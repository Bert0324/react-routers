import React, { CSSProperties, ComponentType } from 'react';

/**
 * Router
 * the path in children will be jointed with the path in parent
 */
export interface IPageRouter {
    path: string;
    /**
     * document.title
     */
    name?: string;
    Component?: () => Promise<ComponentType<any>>;
    children?: IPageRouter[];
}

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
     * if return false, deny to enter route
     */
    beforeEach?: (from: string, to: string) => boolean | undefined | void | Promise<boolean | undefined | void>;
    /**
     * triggered after entering route
     * if return false, deny to enter route
     */
    afterEach?: (from: string, to: string) => void;
}

declare module 'react-routers' {
    const Routers: React.FC<IRouterProps>
    export { Routers };
}