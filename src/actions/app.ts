import { Action } from 'redux';

import { AppRoute, AppRouterInterface } from '../components/lit-router/types';

export const PREFIX: string = 'App: ';

export interface SetAppRouteAction extends Action<string> {
    route?: AppRoute;
    path?: string;
}
export const SET_APP_ROUTE: string = `${PREFIX}SET_APP_ROUTE`;
export const setAppRoute: ((route?: AppRoute, path?: string) => SetAppRouteAction) = (
    route?: AppRoute,
    path?: string,
): SetAppRouteAction => ({
    type: SET_APP_ROUTE,
    route,
    path,
});

// export interface SetAppAuthenticatedAction extends Action<string> {
//     authenticated: boolean;
// }
// export const SET_APP_AUTHENTICATED: string = `${PREFIX}SET_APP_AUTHENTICAED`;
// export const setAppAuthenticated: ((authenticated: boolean) => SetAppAuthenticatedAction) = (
//     authenticated: boolean,
// ): SetAppAuthenticatedAction => ({
//     type: SET_APP_AUTHENTICATED,
//     authenticated,
// });

export interface SetAppRouterAction extends Action<string> {
    router?: AppRouterInterface;
}
export const SET_APP_ROUTER: string = `${PREFIX}SET_APP_ROUTER`;
export const setAppRouter: ((route?: AppRouterInterface) => SetAppRouterAction) = (
    router?: AppRouterInterface,
): SetAppRouterAction => ({
    type: SET_APP_ROUTER,
    router,
});

export interface SetAppPreviousRouteAction extends Action<string> {
    previousRoute?: AppRoute;
    previousPath?: string;
}
export const SET_APP_PREVIOUS_ROUTE: string = `${PREFIX}SET_APP_PREVIOUS_ROUTE`;
export const setAppPreviousRoute: ((previousRoute?: AppRoute, previousPath?: string) => SetAppPreviousRouteAction) = (
    previousRoute?: AppRoute,
    previousPath?: string,
): SetAppPreviousRouteAction => ({
    type: SET_APP_PREVIOUS_ROUTE,
    previousRoute,
    previousPath,
});

// Combined action interface for reducer
export interface AppActions extends
    SetAppRouteAction,
    SetAppRouterAction,
    // SetAppAuthenticatedAction,
    SetAppPreviousRouteAction {}
