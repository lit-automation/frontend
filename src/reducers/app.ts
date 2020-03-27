import {
    AppActions,
    SET_APP_PREVIOUS_ROUTE,
    SET_APP_ROUTE,
    SET_APP_ROUTER,
} from '../actions/app';

import { AppRoute, AppRouterInterface } from '../components/lit-router/types';

export interface AppState {
    route?: AppRoute;
    path?: string;
    router?: AppRouterInterface;
    previousRoute?: AppRoute;
    previousPath?: string;
    authenticated?: boolean;
}

const defaultState: AppState = {
    route: undefined,
    path: '/',
    router: undefined,
    previousRoute: undefined,
    previousPath: undefined,
    authenticated: false,
};

window.storeReducers.app = (state: AppState = defaultState, action: AppActions): AppState => {
    switch (action.type) {
        case SET_APP_ROUTE: {
            return {
                ...state,
                route: action.route,
                path: action.path,
            };
        }
        case SET_APP_ROUTER: {
            return {
                ...state,
                router: action.router,
            };
        }
        case SET_APP_PREVIOUS_ROUTE: {
            return {
                ...state,
                previousRoute: action.previousRoute,
                previousPath: action.previousPath,
            };
        }
        default: {
            return state;
        }
    }
};

declare global {
    interface StoreReducersMap {
        app(state: AppState | undefined, action: AppActions): AppState;
    }

    interface StoreActionsMap {
        app: AppActions;
    }
}
