import React, { CSSProperties, FC, memo, useEffect, useRef, useState } from 'react';
import { matchPath, useHistory } from 'react-router';
import { useRefContext } from '../context/context';
import { filterMatchRoutes, findMatchPath, getWithinTime } from '../utils/utils';

export const KeepAlive: FC<{ path: string }> = memo(({ children, path }) => {
    const history = useHistory();
    const [match, setMatch] = useState(false);
    const [firstMatched, setFirstMatched] = useState(false);
    const [delayMatch, setDelayMatch] = useState(false);
    const data = useRefContext()!;

    const refMatch = useRef(match);
    refMatch.current = match;

    const checkMatch = () => {
        // after history change callback in router
        setTimeout(async () => {
            let currentMatch = !!matchPath(history.location.pathname, {
                path: data.map[path].path,
                exact: true
            });
            const lastMatched = data.map[path].selfMatched[data.map[path].selfMatched.length - 1];
            if (lastMatched && currentMatch) {
                return;
            }
            // if switchRoute, only match one route
            if (data.map[path].switchRoute && data.matched.filter(Boolean).length !== 0) {
                currentMatch = false;
            }

            setMatch(currentMatch);
            data.map[path].selfMatched.push(currentMatch);
            if (currentMatch && !firstMatched) {
                setFirstMatched(true);
            }

            // wait until async component is ready
            const ready = data.map[path]?.ready || await getWithinTime(() => data.map[path]?.ready);

            if (ready) {
                // call active hooks
                if (currentMatch) {
                    filterMatchRoutes(data.actives, data.map[path].path).forEach(
                        effects => Object.keys(effects).forEach(
                            key => effects?.[key]?.()
                        )
                    );
                // call deactive hooks
                } else if (lastMatched) {
                    filterMatchRoutes(data.deactives, data.map[path].path).forEach(
                        effects => Object.keys(effects).forEach(
                            key => effects?.[key]?.()
                        )
                    );
                }
            }
        }, (data.map[path].haveBeforeEach || !!data.map[path].beforeRoute) ? data.map[path].delay : 0);
    };

    useEffect(() => {
        checkMatch();
        history.listen(() => checkMatch());
    }, []);

    useEffect(() => {
        setTimeout(() => setDelayMatch(match), data.map[path].transition?.delay || 500);
    }, [match]);

    // prefetch next
    useEffect(() => {
        if (firstMatched) {
            setTimeout(async () => {
                const ready = data.map[path]?.ready || await getWithinTime(() => data.map[path]?.ready);
                if (ready) {
                    data.map[path].prefetch?.forEach(_fetchPath => {
                        const fetchPath = findMatchPath(data.map, _fetchPath);
                        if (!data.map[fetchPath]?.ready) {
                            setTimeout(() => data.preload[fetchPath]?.(), data.map[path]?.prefetchDelay || 0);
                        }
                    });
                }
            });
        }
    }, [firstMatched]);

    const actualDisplay = data.map[path].transition ? (match ? match : delayMatch) : match;

    // if matched to display immediately, if not, set timeout to hide
    const transitionStyle: CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        ...data.map[path].transition?.trans,
        ...(match ? (
            delayMatch ? data.map[path].transition?.match : data.map[path].transition?.notMatch
        ) : data.map[path].transition?.notMatch)
    };

    return (
        <>
            {data.map[path].alive ? 
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