import {
    Dispatch,
    Middleware,
    MiddlewareAPI,
} from 'redux';
import { setAppPreviousRoute, SetAppRouteAction } from '../actions/app';
import { AppState } from '../reducers/app';

type ActionResolver = ((action: SetAppRouteAction) => AppState);
type DispatchResolver = (next: Dispatch) => ActionResolver;

export const appMiddleware: Middleware = (_API: MiddlewareAPI): DispatchResolver => (next: Dispatch): ActionResolver => (action: SetAppRouteAction): AppState => { // tslint:disable-line:max-line-length ter-max-len
    const appState: AppState = window.store.getState().app;

    switch (action.type) {
        case 'App: SET_APP_ROUTE': {
            window.store.dispatch(setAppPreviousRoute(appState.route, appState.path));
        }
        default:
    }

    return next(action);
};
