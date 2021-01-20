import { ReactNode } from 'react';
import { IBeforeRoute, IAfterRoute } from "../index.d";

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
            node?: ReactNode;
        }
    }
}