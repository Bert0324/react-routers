import React, { FC, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Link, BrowserRouter } from 'react-router-dom';
import { LeftFade, Routers, useParams, useRefContext } from '../src';
import { LoadingPage } from './loading';

const asyncTask = () => new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

const App: FC = () => { 

    const [data, setData] = useState({});

    useEffect(() => {
        setTimeout(() => setData({ a: 1 }), 3000);
    }, []);

    return (
        <BrowserRouter>
            <Routers 
                transition={LeftFade}
                routers={[
                    // {
                    //     path: '/',
                    //     Component: () => () => <Link to='/page1'>page1</Link>
                    // },
                    {
                        path: '/page1',  // test/page1
                        name: 'page1',
                        Component: async () => (await import('./async')).AsyncComponent,
                        keepAlive: true,
                        prefetch: ['/page2', '/page2/:page'],
                        afterRoute: (from, to) => {
                            console.log('afterRoute', from ,to);
                        }
                    },
                    {
                        path: '/page2',  // test/page2
                        Component: async () => (await import('./async2')).AsyncTwoComponent,
                        keepAlive: true,
                        children: [
                            {
                                path: '/:page',     // test/page2/page3
                                name: 'page3',
                                Component: async () => (await import('./async3')).AsyncThreeComponent,
                                beforeRoute: (from, to) => {
                                    // return false;
                                },
                            }
                        ]
                    }
                ]}
                beforeEach={async (from, to) => {
                    // await asyncTask();
                    console.log('beforeEach', from, to, data);
                }}
                redirect='/page1'
                fallback={LoadingPage}
            />            
            {/* <Routers 
                routers={[
                    // {
                    //     path: '/',
                    //     Component: () => () => <Link to='/page1'>page1</Link>
                    // },
                    {
                        path: '/page1',  // test/page1
                        name: 'page4',
                        Component: async () => (await import('./async')).AsyncComponent,
                        keepAlive: true,
                        afterRoute: (from, to) => {
                            console.log('afterRoute', from ,to);
                        }
                    },
                ]}
                fallback={LoadingPage}
            /> */}
        </BrowserRouter>
    );
};

render(<App />, document.getElementById('root'));