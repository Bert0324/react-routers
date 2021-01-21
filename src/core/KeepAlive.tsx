import React, { FC, memo, useEffect, useState } from 'react';
import { matchPath, useHistory } from 'react-router';
import { useRefContext } from '../context/context';
import { IConfig } from '../type/type.d';
import { filterMatchRoutes } from '../utils/utils';

export const KeepAlive: FC<{ config: IConfig }> = memo(({ children, config }) => {
    const history = useHistory();
    const [match, setMatch] = useState(false);
    const [firstMatched, setFirstMatched] = useState(false);
    const data = useRefContext();

    const checkMatch = () => {
        // after history change callback in router
        setTimeout(() => {
            let currentMatch = !!matchPath(history.location.pathname, {
                path: config.path,
                exact: true
            });
            // if switchRoute, only match one route
            if (config.switchRoute && data.matched.filter(Boolean).length !== 0) {
                currentMatch = false;
            }

            setMatch(currentMatch);
            config.selfMatched.push(currentMatch);
            if (currentMatch && !firstMatched) {
                setFirstMatched(true);
            }

            if (!firstMatched) {
                if (currentMatch) {
                    filterMatchRoutes(data.actives, config.path).forEach(effects => effects.forEach(effect => effect()));
                } else if (config.selfMatched[config.selfMatched.length - 2]) {
                    filterMatchRoutes(data.deactives, config.path).forEach(effects => effects.forEach(effect => effect()));
                }
            }
        });
    };

    useEffect(() => {
        checkMatch();
        history.listen(() => checkMatch());
    }, []);

    useEffect(() => () => {

    }, [match]);
    
    return (
        <>
            {config.alive ? 
            <>
                {firstMatched ?                 
                <div style={{ display: match ? '' : 'none' }}>
                    {children}
                </div> : null}
            </>
            : 
            match ? children : null}
        </>
    );
});