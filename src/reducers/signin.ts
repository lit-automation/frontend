import {
    REQUEST_SIGNIN,
    REQUEST_SIGNIN_FAILURE,
    REQUEST_SIGNIN_SUCCES,
    SigninActions,
} from '../actions/authorization/signin';

export interface SigninState {
    email?: string;
    password?: string;
    jwt?: string;
    error?: string;
}

const defaultState: SigninState = {
    email: undefined,
    password: undefined,
};

window.storeReducers.signin = (state: SigninState = defaultState, action: SigninActions): SigninState => {
    switch (action.type) {
        case REQUEST_SIGNIN: {
            return {
                ...state,
                email: action.email,
                password: action.password,
            };
        }
        case REQUEST_SIGNIN_SUCCES: {
            return {
                ...state,
                jwt: action.jwt,
                error: undefined,
            };
        }
        case REQUEST_SIGNIN_FAILURE: {
            return {
                ...state,
                error: action.error,
            };
        }
        default: {
            return state;
        }
    }
};

declare global {
    interface StoreReducersMap {
        signin(state: SigninState | undefined, action: SigninActions): SigninState;
    }

    interface StoreActionsMap {
        signin: SigninActions;
    }
}