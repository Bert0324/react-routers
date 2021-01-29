import { FC, CSSProperties, ComponentType, DependencyList } from 'react';
import { match } from 'react-router';

interface IConfig {
    name: string;
    beforeRoute?: IBeforeRoute;
    afterRoute?: IAfterRoute;
    alive: boolean;
    selfMatched: boolean[];
    path: string;
    switchRoute: boolean;
    transition?: ITransition;
    delay: number;
    haveBeforeEach: boolean;
    ready: boolean;
    prefetch?: string[];
    prefetchDelay?: number;
}

export interface IRefObj {
    historyChangeHandler?: () => void;
    stack: string[];
    isReplace: boolean;
    originalTitle: string;
    map: {
        [path: string]: IConfig;
    };
    actives: {
        [path: string]: {
            [id: string]: EffectHook
        };
    };
    deactives: {
        [path: string]: {
            [id: string]: EffectHook;
        }
    };
    matched: boolean[];
    preload: {
        [path: string]: () => Promise<{ default: any }>;
    };
}

export type IBeforeRoute = (from: string, to: string) => boolean | undefined | void | Promise<boolean | undefined | void>;
export type IAfterRoute = (from: string, to: string) => void;
export type ITransition = {
    match: CSSProperties;
    notMatch: CSSProperties;
    trans: CSSProperties;
    /**
     * keep component after unmatched
     * - default is `500`ms
     */
    delay?: number;
};
export type EffectHook = () => void;
export type ActiveHook = (effect: EffectHook, deps?: DependencyList) => void;

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
    /**
     * transition animation
     */
    transition?: ITransition;
    /**
     * the path list to prefetch
     * - parent node prefetch will be append after current node prefetch
     */
    prefetch?: string[];
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
    /**
     * transition animation
     */
    transition?: ITransition;
    /**
     * loading delay
     * - default is `100`ms
     */
    delay?: number;
    /**
     * how much time delayed to start prefetch after main thread is idle
     * - default is `0` ms
     */
    prefetchDelay?: number;
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
    const useActive: ActiveHook;
    /**
     * triggered when leave the route
     */
    const useDeactive: ActiveHook;
    /**
     * `useRouteMatch` like <https://reactrouter.com/web/api/Hooks/useroutematch>
     */
    const useRouteMatch: <T = {}>() => match<T>;
    /**
     * `useParams` like <https://reactrouter.com/core/api/Hooks/useparams>
     */
    const useParams: <T = {}>() => T;
    /**
     * get current configuration
     */
    const useRefContext: () => IRefObj | null;
    const Fade: ITransition;
    const LeftFade: ITransition;
    const RightFade: ITransition;
    const TopFade: ITransition;
    const BottomFade: ITransition;
    const LeftSlide: ITransition;
    const RightSlide: ITransition;
    const TopSlide: ITransition;
    const BottomSlide: ITransition;
    export {
        Routers, 
        useActive, 
        useDeactive,
        useParams, 
        useRouteMatch,
        useRefContext,
        Fade,
        LeftFade,
        RightFade,
        TopFade,
        BottomFade,
        LeftSlide,
        RightSlide,
        TopSlide,
        BottomSlide
    };
}
