import React, { FC, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Link, BrowserRouter } from 'react-router-dom';
import { TopSlide, Routers, useParams, useRefContext } from 'react-routers';
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
                transition={TopSlide}
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
                        afterRoute: (from, to) => {
                            console.log('afterRoute', from ,to);
                        }
                    },
                    {
                        path: '/page2',  // test/page2
                        Component: async () => () => <div style={{ height: '80vh', width: '80vw', backgroundColor: 'blue' }}><Link to='/page2/page3'>page2</Link></div>,
                        children: [
                            {
                                path: '/:page',     // test/page2/page3
                                name: 'page3',
                                Component: async () => () => {
                                    // const params = useParams();
                                    // console.log(params);
                                    return <>page3</>
                                },
                                beforeRoute: (from, to) => {
                                    return false;
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