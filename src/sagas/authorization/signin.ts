import { ForkEffect, SelectEffect, takeLatest } from 'redux-saga/effects';
import { showNotification } from '../../elements/Notification';
import {
    REQUEST_SIGNIN,
    REQUEST_SIGNIN_FAILURE,
    REQUEST_SIGNIN_SUCCES,
    RequestSigninAction,
    requestSigninFailure,
    RequestSigninFailureAction,
    requestSigninSucces,
} from '../../actions/authorization/signin';

window.storeSagas.watchRequestSignin = function*():  IterableIterator<ForkEffect | SelectEffect> {
    yield takeLatest(REQUEST_SIGNIN, fetchSignin);
}

window.storeSagas.watchRequestSigninSucces = function*(): IterableIterator<ForkEffect | SelectEffect> {
    yield takeLatest(REQUEST_SIGNIN_SUCCES, (): void => {
        showNotification("Successfully signed in")

    });
}


window.storeSagas.watchRequestSigninFailure = function*():IterableIterator<ForkEffect | SelectEffect> {
    yield takeLatest(REQUEST_SIGNIN_FAILURE, (action: RequestSigninFailureAction): void => {
        if (action.error) {
            showNotification(action.error)
        } else {
            showNotification("Unable to signin")
        }
    });
}

// fetchSignin
function* fetchSignin(action: RequestSigninAction): Generator {
    try {
        if (!action.email) {
            return
        }
        if (!action.password) {
            return
        }

        let token = action.email + ":" + action.password;
        let basicAuth = "Basic " + btoa(token);

        fetch(window.API_LINK + "/jwt/signin", {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': basicAuth
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        }).then(async (resp) => {
            if (resp.status !== 200) {
                let response = await resp.json()
                window.store.dispatch(requestSigninFailure(response.detail))
            } else {
                let jwt = resp.headers.get("Authorization")
                if (!jwt) {
                    jwt = ""
                }else{
                    localStorage.setItem('jwt',jwt);
                }
                window.store.dispatch(requestSigninSucces(jwt, action.email))
            }
        })
    } catch (exception) {
        window.store.dispatch(requestSigninFailure(exception))

    }
}
