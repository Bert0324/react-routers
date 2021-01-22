import React, { FC, memo, useEffect, useState } from 'react';
import { matchPath, useHistory } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { useRefContext } from '../context/context';
import { IConfig } from '../../index.d';
import { filterMatchRoutes } from '../utils/utils';
import './index.less';

export const KeepAlive: FC<{ config: IConfig }> = memo(({ children, config }) => {
    const history = useHistory();
    const [match, setMatch] = useState(false);
    const [firstMatched, setFirstMatched] = useState(false);
    const data = useRefContext()!;

    const checkMatch = () => {
        // after history change callback in router
        setTimeout(() => {
            let currentMatch = !!matchPath(history.location.pathname, {
                path: config.path,
                exact: true
            });
            const lastMatched = config.selfMatched[config.selfMatched.length - 1];
            if (lastMatched && currentMatch) {
                return;
            }
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
                } else if (lastMatched) {
                    filterMatchRoutes(data.deactives, config.path).forEach(effects => effects.forEach(effect => effect()));
                }
            }
        });
    };

    useEffect(() => {
        checkMatch();
        history.listen(() => checkMatch());
    }, []);

    return (
        <>
            {config.alive ? 
                <>
                    {firstMatched ?    
                    <CSSTransition
                        in={match}
                        timeout={200}
                        classNames='my-node'
                    >
                         <div style={{ display: match ? '' : 'none' }}>
                            {children}
                        </div>
                    </CSSTransition>             
                        : null}
                </>
            : 
            match ? children : null}
        </>
    );
}, (prev, next) => JSON.stringify(prev.config) === JSON.stringify(next.config));