import { useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router";
import { ActiveHook } from "../../index.d";
import { notExistPath } from "../utils/constants";
import { findMatch, findMatchPath } from "../utils/utils";
import { useRefContext } from "./context";

/**
 * push active callback
 * @param effect 
 * @param deps 
 */
export const useActive: ActiveHook = (effect, deps) => {
    const data = useRefContext()!;
    const history = useHistory();
    const path = useMemo(() => findMatchPath(data.map, history.location.pathname), [history.location.pathname]);
    const id = useMemo(() => `${Math.random()}`, []);

    const updateActiveHandler = useCallback(() => {
        if (path !== notExistPath) {
            if (!data.actives[path]) {
                data.actives[path] = {};
            }
            data.actives[path][id] = effect;
        }
    }, deps || []);

    useEffect(() => {
        updateActiveHandler();
    }, [updateActiveHandler]);
};

/**
 * push deactive callback
 * @param effect 
 * @param deps 
 */
export const useDeactive: ActiveHook = (effect, deps) => {
    const data = useRefContext()!;
    const history = useHistory();
    const path = useMemo(() => findMatchPath(data.map, history.location.pathname), [history.location.pathname]);
    const id = useMemo(() => `${Math.random()}`, []);

    const updateDeactiveHandler = useCallback(() => {
        if (path !== notExistPath) {
            if (!data.deactives[path]) {
                data.deactives[path] = {};
            }
            data.deactives[path][id] = effect;
        }
    }, deps || []);

    useEffect(() => {
        updateDeactiveHandler();
    }, [updateDeactiveHandler]);
};

/**
 * replacement for `useRouteMatch`
 */
export const useRouteMatch = <T = {}>() => {
    const history = useHistory();
    const { map } = useRefContext()!;
    return findMatch<T>(map, history.location.pathname);
};

/**
 * replacement for `useParams`
 */
export const useParams = <T = {}>() => {
    const match = useRouteMatch<T>();
    return match?.params;
};
