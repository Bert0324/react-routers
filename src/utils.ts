import { matchPath } from "react-router";

export const findMatchRoute = <T>(map: { [key: string]: T }, path: string) => {
    return map[Object.keys(map || {}).find(key => matchPath(path, {
        path: key,
        exact: true
    })) || ''];
}