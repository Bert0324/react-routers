import { match, matchPath } from "react-router";
import { notExistPath } from "./constants";

const getOptions = (path: string) => ({
    path,
    exact: true
});

export const findMatchPath = <T>(map: { [key: string]: T }, path: string) => {
    return Object.keys(map).find(key => matchPath(path, getOptions(key))) || notExistPath;
};

export const findMatchRoute = <T>(map: { [key: string]: T }, path: string) => {
    return map[findMatchPath(map, path)];
};

export const filterMatchRoutes = <T>(map: { [key: string]: T }, path: string) => {
    return Object.keys(map).filter(key => matchPath(path, getOptions(key))).reduce((acc, key) => {
        acc.push(map[key]);
        return acc;
    }, [] as T[]);
};

export const findMatch = <T = {}>(map: { [key: string]: any }, path: string) => {
    return Object.keys(map).reduce((acc, key) => {
        const match = matchPath<T>(path, getOptions(key));
        if (match) {
            acc = match;
        }
        return acc;
    }, undefined as unknown as match<T>);
};

export const setTimeoutTask = <T>(task: () => T) => new Promise<T>(resolve => setTimeout(() => {
    resolve(task());
}, 100));

export const getWithinTime = async <T>(task: () => T) => {
    const timeout = 10000;
    const start = Number(new Date());
    while (Number(new Date()) - start < timeout) {
        const res = await setTimeoutTask(task);
        if (res) return res;
    }
    return undefined;
};