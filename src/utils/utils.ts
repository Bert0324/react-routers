import { matchPath } from "react-router";
import { notExistPath } from "./constants";

export const findMatchPath = <T>(map: { [key: string]: T }, path: string) => {
    return Object.keys(map).find(key => matchPath(path, {
        path: key,
        exact: true
    })) || notExistPath;
};

export const findMatchRoute = <T>(map: { [key: string]: T }, path: string) => {
    return map[findMatchPath(map, path)];
};

export const filterMatchRoutes = <T>(map: { [key: string]: T }, path: string) => {
    return Object.keys(map).filter(key => matchPath(path, {
        path: key,
        exact: true
    })).reduce((acc, key) => {
        acc.push(map[key]);
        return acc;
    }, [] as T[]);
};