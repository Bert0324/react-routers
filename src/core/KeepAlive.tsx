import React, { FC, memo, useEffect, useState } from 'react';
import { matchPath, useHistory } from 'react-router';
import { useRefContext } from '../context/context';
import { EffectHook } from '../../index.d';
import { filterMatchRoutes, getWithinTime } from '../utils/utils';

export const KeepAlive: FC<{ path: string }> = memo(({ children, path }) => {
    const history = useHistory();
    const [match, setMatch] = useState(false);
    const [firstMatched, setFirstMatched] = useState(false);
    const [delayMatch, setDelayMatch] = useState(false);
    const data = useRefContext()!;
    const config = data.map[path];

    const checkMatch = () => {
        // after history change callback in router
        setTimeout(async () => {
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

            // wait until async component is ready
            const ready = config?.ready || await getWithinTime(() => config?.ready);

            if (ready) {
                // call active hooks
                if (currentMatch) {
                    let collectDeactives = false;
                    if (!data.deactives[config.path]) {
                        collectDeactives = true;
                        data.deactives[config.path] = {};
                    }
                    filterMatchRoutes(data.actives, config.path).forEach(
                        effects => Object.keys(effects).forEach(key => {
                            const deactive = effects[key]?.();
                            if (collectDeactives && Object.prototype.toString.call(deactive) === '[object Function]') {
                                data.deactives[config.path][key] = deactive as EffectHook;
                            }
                        })
                    );
                } else if (lastMatched) {
                    filterMatchRoutes(data.deactives, config.path).forEach(
                        effects => Object.keys(effects).forEach(
                            key => data.deactives[config.path]?.[key]?.()
                        )
                    );
                }
            }
        }, (config.haveBeforeEach || !!config.beforeRoute) ? config.delay : 0);
    };

    useEffect(() => {
        checkMatch();
        history.listen(() => checkMatch());
    }, []);

    useEffect(() => {
        setTimeout(() => setDelayMatch(match), config.transition?.delay || 500);
    }, [match]);

    const transitionStyle = {
        ...config.transition?.trans,
        ...(match ? config.transition?.match : config.transition?.notMatch)
    };

    const actualDisplay = config.transition ? delayMatch : match;

    return (
        <>
            {config.alive ? 
                <>
                    {firstMatched ?    
                        <div 
                            style={{ display: actualDisplay ? '' : 'none', ...transitionStyle }}
                        >
                            {children}
                        </div>      
                        : null}
                </>
            : 
            <div style={transitionStyle}>
                {actualDisplay ? children : null}
            </div>}
        </>
    );
}, (prev, next) => prev.path === next.path);