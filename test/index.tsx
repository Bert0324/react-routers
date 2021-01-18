import React, { FC } from 'react';
import { render } from 'react-dom';
import { Link, BrowserRouter } from 'react-router-dom';
import { Routers } from '../src/router';

const asyncTask = () => new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

const App: FC = () => { 
    return (
        <BrowserRouter basename='/test'>
            <Routers 
                routers={[
                    {
                        path: '/page1',  // test/page1
                        name: 'page1',
                        Component: async () => () => (
                            <>
                                page1
                                <Link to='/page2'>page2</Link>
                            </>
                        ),
                        afterRoute: (from, to) => {
                            console.log(from ,to);
                        }
                    },
                    {
                        path: '/page2',  // test/page2
                        Component: async () => () => <Link to='/page2/page3'>page2</Link>,
                        children: [
                            {
                                path: '/page3',     // test/page2/page3
                                name: 'page3',
                                Component: async () => () => <>page3</>,
                                beforeRoute: (from, to) => {
                                    console.log(from ,to);
                                    return false;
                                },
                            }
                        ]
                    }
                ]}
                beforeEach={async (from, to) => {
                    await asyncTask();
                    console.log('beforeEach', from, to);
                }}
                redirect='/page1'
            />
        </BrowserRouter>
    );
};

render(<App />, document.getElementById('root'));