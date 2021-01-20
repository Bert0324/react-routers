import { useEffect } from "react";
import { useHistory } from "react-router";
import { useRefContext } from "./context";

export const useActive = (effect: () => void) => {
    const { actives } = useRefContext();
    const history = useHistory();
    useEffect(() => {
       if (!actives[history.location.pathname]) {
           actives[history.location.pathname] = [];
       }
       actives[history.location.pathname].push(effect);
    }, []);
};

export const useDeActive = (effect: () => void) => {
    const { deactives } = useRefContext();
    const history = useHistory();
    useEffect(() => {
        if (!deactives[history.location.pathname]) {
            deactives[history.location.pathname] = [];
        }
        deactives[history.location.pathname].push(effect);
    }, []);
};