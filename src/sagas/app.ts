import { ForkEffect, SelectEffect, takeLatest } from 'redux-saga/effects';
import {
    SET_APP_ROUTE,
    SET_APP_ROUTER,
    SetAppRouteAction,
    SetAppRouterAction,
} from '../actions/app';

window.storeSagas.watchSetAppRoute = function*(): IterableIterator<ForkEffect | SelectEffect> {
    yield takeLatest(SET_APP_ROUTE, (_ACTION: SetAppRouteAction): void => {
    });
}

window.storeSagas.watchSetAppRouter = function*():  IterableIterator<ForkEffect | SelectEffect> {
    yield takeLatest(SET_APP_ROUTER, (_ACTION: SetAppRouterAction): void => {
    });
}
