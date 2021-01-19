# react-routers

A React Component for quick configuring route.

## Features

- Route Configuration like `react-router-config`
- Route Guard like `Vue`
- Simple Lazy Load
- Tiny, unpacked Only **4KB**
- Full Typescript Support

## Documents

```ts
/**
 * Router Configuration
 * the path in children will be jointed with the path in parent
 */
export interface IPageRouter {
    /**
     * route path
     */
    path: string;
    /**
     * document.title
     */
    name?: string;
    /**
     * the lazy load Component
     */
    Component?: () => (Promise<ComponentType<any>> | ComponentType<any>);
    /**
     * children configuration
     */
    children?: IPageRouter[];
    /**
     * triggered before entering route
     * - if return false, deny to enter route\
     * - after `beforeEach`
     */
    beforeRoute?: IBeforeRoute;
    /**
     * triggered after entering route
     * - if return false, deny to enter route
     * - ahead of `afterEach`
     */
    afterRoute?: IAfterRoute;
}

/**
 * `react-routers` props
 */
export interface IRouterProps {
    /**
     * routers configuration
     */
    routers: IPageRouter[]; 
    /**
     * A fallback react tree to show when a Suspense child (like React.lazy) suspends
     */
    fallbackPage?: ComponentType<any>;
    /**
     * A fallback react tree to show before entering the route
     */
    loadingPage?: ComponentType<any>;
    /**
     * redirect path
     */
    redirect?: string;
    /**
     * css style
     */
    style?: CSSProperties;
    /**
     * triggered before entering route
     * - if return false, deny to enter route
     * - ahead of any `beforeRoute`
     */
    beforeEach?: IBeforeRoute;
    /**
     * triggered after entering route
     * - if return false, deny to enter route
     * - after any `afterRoute`
     */
    afterEach?: IAfterRoute;
}
```

## Demo

Use `react-routers` like as below:

```tsx
import { Link, BrowserRouter } from 'react-router-dom';
import { Routers } from 'react-routers';

const asyncTask = () => new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

const Routers: FC = () => { 
    return (
        <BrowserRouter basename='/test'>
            <Routers 
                routers={[
                    {
                        path: '/page1',  // test/page1
                        name: 'page1',
                        Component: async () => (await import('./PageComponent')).PageComponent,
                        afterRoute: (from, to) => {
                            console.log(from ,to);
                        }
                    },
                    {
                        path: '/page2',  // test/page2
                        name: 'page2',
                        Component: () => () => <Link to='/page2/page3'>page2</Link>,
                        beforeRoute: (from, to) => {
                            console.log(from ,to);
                            return false;
                        },
                        children: [
                            {
                                path: '/page3',     // test/page2/page3
                                name: 'page3',
                                Component: async () => () => <>page3</>,
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
```

## Development

- `yarn`
- `preview=true yarn dev`
- `yarn build`
