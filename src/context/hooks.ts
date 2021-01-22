import { useEffect } from "react";
import { useHistory } from "react-router";
import { notExistPath } from "../utils/constants";
import { findMatch, findMatchPath } from "../utils/utils";
import { useRefContext } from "./context";

/**
 * push active callback to ref
 * @param effect 
 */
export const useActive = (effect: () => void) => {
    const data = useRefContext()!;
    const history = useHistory();
    useEffect(() => {
        const key = findMatchPath(data.map, history.location.pathname);
        if (key !== notExistPath) {
            if (!data.actives[key]) {
                data.actives[key] = [];
            }
            data.actives[key].push(effect);
        }
        return () => {
            if (key !== notExistPath) {
                data.actives[key] = data.actives[key]?.filter(item => item !== effect);
            }
        };
    }, []);
};

/**
 * push deactive callback to ref
 * @param effect 
 */
export const useDeActive = (effect: () => void) => {
    const { deactives, map } = useRefContext()!;
    const history = useHistory();
    useEffect(() => {
       const key = findMatchPath(map, history.location.pathname);
       if (key !== notExistPath) {
           if (!deactives[key]) {
            deactives[key] = [];
           }
           deactives[key].push(effect);
       }
       return () => {
           if (key !== notExistPath) {
                deactives[key] = deactives[key]?.filter(item => item !== effect)
           }
       };
    }, []);
};

export const useParams = <T = {}>() => {
    const history = useHistory();
    const { map } = useRefContext()!;
    return findMatch<T>(map, history.location.pathname)?.params;
};