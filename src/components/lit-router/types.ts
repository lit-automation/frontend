import { Router } from '@vaadin/router';

import * as Middleware from './middleware';

export interface RouteChangeEvent extends CustomEvent {
    detail: {
        router: Router;
        location: Router.Location;
    };
}

type Diff<T extends keyof any, U extends keyof any> = (
    { [P in T]: P } &
    { [P in U]: never } &
    { [x: string]: never}
)[T];
type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export type Children = AppRoute[] | Router.ChildrenFn;

interface BaseRouteExtension {
    children?: Children;
}
export interface AppBaseRoute extends Overwrite<Router.BaseRoute, BaseRouteExtension> {
    __children?: AppRoute[];
    parent?: AppRoute;

    middlewares?: Middleware.Name[];

    showHeader?: boolean;
    showFooter?: boolean;
    dashboardMenu?: boolean;
}
export interface AppRouteWithAction extends AppBaseRoute {
    action: Router.ActionFn;
}
export interface AppRouteWithBundle extends AppBaseRoute {
    bundle: string;
}
export interface AppRouteWithChildren extends AppBaseRoute {
    children: Children;
}
export interface AppRouteWithComponent extends AppBaseRoute {
    component: string;
}
export interface AppRouteWithRedirect extends AppBaseRoute {
    redirect: string;
}

export type AppRoute = AppRouteWithAction
    | AppRouteWithBundle
    | AppRouteWithChildren
    | AppRouteWithComponent
    | AppRouteWithRedirect
    | AppBaseRoute;

export interface RouterExtension {
    getRoutes(): AppRoute[];

    addRoutes(routes: AppRoute[]|AppRoute): AppRoute[];
}
export type Routes = AppRouteWithAction
    | AppRouteWithBundle
    | AppRouteWithChildren
    | AppRouteWithComponent
    | AppRouteWithRedirect
    | AppRoute[];
export interface AppRouterInterface extends Overwrite<Router, RouterExtension> {
    setRoutes(
        routes: Routes,
        skipRender?: boolean | null,
    ): Promise<Node>;

    getRoutes(): AppRoute[];
}

// tslint:disable-next-line: no-empty-interface
export interface AppRouteLocation extends Router.Location {}

/**
 * Export AppRouterClass
 */
export class AppRouter extends Router {
    public route?: AppRoute;
}
