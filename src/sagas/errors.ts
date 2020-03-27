import { ForkEffect, SelectEffect, takeLatest } from 'redux-saga/effects';
import { SET_ERRORS_SIGN_IN_ERROR, SetErrorsSignInErrorAction } from '../actions/errors';

window.storeSagas.watchSetErrorsError = function*(): IterableIterator<ForkEffect | SelectEffect> {
    yield takeLatest(SET_ERRORS_SIGN_IN_ERROR, (_ACTION: SetErrorsSignInErrorAction): void => {
        //
    });
}
