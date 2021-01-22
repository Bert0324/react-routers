import { useEffect } from "react";
import { useHistory } from "react-router";
import { ActiveHook } from "../../index.d";
import { notExistPath } from "../utils/constants";
import { findMatch, findMatchPath } from "../utils/utils";
import { useRefContext } from "./context";

/**
 * push active callback to ref
 * @param effect 
 */
export const useActive: (effect: ActiveHook) => void = effect => {
    const data = useRefContext()!;
    const history = useHistory();
    useEffect(() => {
        const key = findMatchPath(data.map, history.location.pathname);
        const id = `${Math.random()}`;
        if (key !== notExistPath) {
            if (!data.actives[key]) {
                data.actives[key] = {};
            }
            data.actives[key][id] = effect;
        }
        return () => {
            if (key !== notExistPath) {
                delete data.actives[key]?.[id];
                delete data.deactives[key]?.[id];
            }
        };
    }, []);
};

/**
 * replacement for `useParams`
 */
export const useParams = <T = {}>() => {
    const history = useHistory();
    const { map } = useRefContext()!;
    return findMatch<T>(map, history.location.pathname)?.params;
};