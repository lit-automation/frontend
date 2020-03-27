import {
    Dispatch,
    Middleware,
    MiddlewareAPI,
} from 'redux';
import { reduxAsyncExample } from '../reducers/reduxAsyncExample';
// import { store } from '../store';

type ActionResolver = ((action: typeof reduxAsyncExample.actions) => typeof reduxAsyncExample.state);
type DispatchResolver = (next: Dispatch) => ActionResolver;

export const reduxAsyncExampleMiddleware: Middleware = (_API: MiddlewareAPI): DispatchResolver => (next: Dispatch): ActionResolver => (action: typeof reduxAsyncExample.actions): typeof reduxAsyncExample.state => { // tslint:disable-line:max-line-length ter-max-len
    // const state: typeof reduxAsyncExample.state = store.getState().reduxAsyncExample;

    switch (action.type) {
        case 'start': {
        }
        default:
    }

    // @ts-ignore
    return next(action);
};
