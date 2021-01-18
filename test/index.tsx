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
                        path: '/page1',
                        name: 'page1',
                        Component: async () => () => <>
                            page1
                            <Link to='/page2'>page2</Link>
                        </>
                    },
                    {
                        path: '/page2',
                        name: 'page2',
                        Component: async () => () => <>page2</>
                    }
                ]}
                beforeEach={async (from, to) => {
                    console.log('beforeEach', from, to);
                    await asyncTask();
                }}
                redirect='/page1'
            />
        </BrowserRouter>
    );
};

render(<App />, document.getElementById('root'));