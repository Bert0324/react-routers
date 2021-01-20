import { matchPath } from "react-router";

export const findMatchRoute = <T>(map: { [key: string]: T }, path: string) => {
    return map[Object.keys(map || {}).find(key => matchPath(path, {
        path: key,
        exact: true
    }))];
};

export const filterMatchRoutes = <T>(map: { [key: string]: T }, path: string) => {
    return Object.keys(map || {}).filter(key => matchPath(path, {
        path: key,
        exact: true
    })).reduce((acc, key) => {
        acc.push(map[key]);
        return acc;
    }, [] as T[]);
}