import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Link, BrowserRouter } from 'react-router-dom';
import { useActive, useDeActive } from '../src';
import { Routers } from '../src/core/Router';
import { LoadingPage } from './loading';

const asyncTask = () => new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

const Sub: FC = () => {

    const [count, setCount] = useState(0);

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>{count}</button>
        </div>
    )
};


let cache: any;
const KeepAlive: FC = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

const App: FC = () => { 

    const [data, setData] = useState({});

    useEffect(() => {
        setTimeout(() => setData({ a: 1 }), 3000);
    }, []);

    return (
        <BrowserRouter basename='/test'>
            <Routers 
                routers={[
                    // {
                    //     path: '/',
                    //     Component: () => () => <Link to='/page1'>page1</Link>
                    // },
                    {
                        path: '/page1',  // test/page1
                        name: 'page1',
                        Component: () => () => {
                            const [show, setShow] = useState<boolean>(true);
                            useActive(() => {
                                console.log('active');
                            });
                            useDeActive(() => {
                                console.log('deactive');
                            });
                            return (
                                <>
                                    page1
                                    <Link to='/page2'>page2</Link>
                                    <div>
                                        <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
                                        {show && <Sub />}
                                        {show && <KeepAlive><Sub /></KeepAlive>}
                                    </div>
                                </>
                            )
                        },
                        keepAlive: true,
                        afterRoute: (from, to) => {
                            console.log(from ,to);
                        }
                    },
                    {
                        path: '/page2',  // test/page2
                        Component: async () => () => <Link to='/page2/page3'>page2</Link>,
                        children: [
                            {
                                path: '/:page',     // test/page2/page3
                                name: 'page3',
                                Component: async () => () => <>page3</>,
                                beforeRoute: (from, to) => {
                                    return false;
                                },
                            }
                        ]
                    }
                ]}
                beforeEach={async (from, to) => {
                    await asyncTask();
                    console.log('beforeEach', from, to, data);
                }}
                redirect='/page1'
                fallback={LoadingPage}
            />
        </BrowserRouter>
    );
};

render(<App />, document.getElementById('root'));