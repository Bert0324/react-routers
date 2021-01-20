import React, { FC, memo, useEffect, useState } from 'react';
import { matchPath, useHistory } from 'react-router';
import { useRefContext } from '../context/context';
import { filterMatchRoutes } from '../utils/utils';

export const KeepAlive: FC<{ path: string; alive: boolean }> = memo(({ children, path, alive }) => {
    
    const history = useHistory();
    const [match, setMatch] = useState(false);

    const { actives, deactives, stack } = useRefContext();

    const checkMatch = () => {
        setMatch(!!matchPath(history.location.pathname, {
            path,
            exact: true
        }));
    };
    useEffect(() => {
        checkMatch();
        history.listen(() => checkMatch());
    }, []);

    useEffect(() => {
        if (alive) {
            filterMatchRoutes(match ? actives : deactives, history.location.pathname).forEach(effects => effects.forEach(effect => effect()));
        }
    }, [match]);
    
    return (
        <>
            {alive ? 
            <div style={{ display: match ? '' : 'none' }}>
                {children}
            </div> : 
            match ? children : null}
        </>
    );
});