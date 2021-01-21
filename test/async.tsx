import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useActive, useDeActive } from '../src';

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
    useActive(() => {
        console.log('page1 active');
    });
    useDeActive(() => {
        console.log('page1 deactive');
    });
    return (
        <>
            page1
            <Link to='/page2'>page2</Link>
            <div>
                <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
                {show && <Sub />}
            </div>
        </>
    )
}