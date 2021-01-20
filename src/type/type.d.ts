import { IBeforeRoute, IAfterRoute } from "../..";

export interface IRefObj {
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
    };
    actives: {
        [path: string]: (() => void)[];
    };
    deactives: {
        [path: string]: (() => void)[];
    };
}