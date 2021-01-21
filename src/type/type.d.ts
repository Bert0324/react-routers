import { IBeforeRoute, IAfterRoute } from "../../index.d";

interface IConfig {
    name: string;
    beforeRoute: IBeforeRoute;
    afterRoute: IAfterRoute;
    alive: boolean;
    selfMatched: boolean[];
    path: string;
    switchRoute: boolean;
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
        [path: string]: (() => void)[];
    };
    deactives: {
        [path: string]: (() => void)[];
    };
    matched: boolean[];
}