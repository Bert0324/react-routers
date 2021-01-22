import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useActive, useRefContext } from '../src/index';

const Sub: FC = () => {

    const [count, setCount] = useState(0);

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>{count}</button>
        </div>
    )
};

export const AsyncComponent: FC = () => {
    const [show, setShow] = useState<boolean>(true);
    const data = Number(new Date());
    useActive(() => {
        console.log('page1 active', data);
        return () => {
            console.log('page1 deactive', data);
        }
    });

    const ref = useRefContext();
    console.log(ref)

    return (
        <div style={{ height: '80vh', width: '80vw', backgroundColor: 'yellow' }}>
            page1
            <Link to='/page2'>page2</Link>
            <div>
                <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
                {show && <Sub />}
            </div>
        </div>
    )
}