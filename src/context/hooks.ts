import { useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { UseActive } from "../../index.d";
import { notExistPath } from "../utils/constants";
import { findMatch, findMatchPath } from "../utils/utils";
import { useRefContext } from "./context";

/**
 * push active callback to ref
 * @param effect 
 */
export const useActive: UseActive = (effect, deps) => {
    const data = useRefContext()!;
    const history = useHistory();
    const ref = useRef<{ active: Function; deactive: Function }>();

    const active = useCallback(() => {
        const key = findMatchPath(data.map, history.location.pathname);
        const id = `${Math.random()}`;
        if (key !== notExistPath) {
            if (!data.actives[key]) {
                data.actives[key] = {};
            }
            data.actives[key][id] = effect;
        }
        return { key, id };
    }, deps || []);

    const deactive = useCallback((key: string, id: string) => {
        if (key !== notExistPath) {
            delete data.actives[key]?.[id];
            delete data.deactives[key]?.[id];
        }
    }, deps || []);

    ref.current = { active, deactive };

    useEffect(() => {
        const { key, id } = ref.current.active();
        return () => ref.current.deactive(key, id);
    }, deps || []);
};

/**
 * replacement for `useParams`
 */
export const useParams = <T = {}>() => {
    const history = useHistory();
    const { map } = useRefContext()!;
    return findMatch<T>(map, history.location.pathname)?.params;
};