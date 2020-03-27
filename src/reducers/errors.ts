import { TemplateResult } from 'lit-element';
import {
    ErrorsActions,
    SET_ERRORS_SIGN_IN_ERROR,
} from '../actions/errors';

export interface ErrorsState {
    signin: TemplateResult[];
    register: TemplateResult[];
    totp: TemplateResult[];
}

const defaultState: ErrorsState = {
    signin: [],
    register: [],
    totp: [],
};

window.storeReducers.errors = (state: ErrorsState = defaultState, action: ErrorsActions): ErrorsState => {
    switch (action.type) {
        case SET_ERRORS_SIGN_IN_ERROR: {
            return {
                ...state,
                signin: action.signin,
            };
        }
        default: {
            return state;
        }
    }
};

declare global {
    interface StoreReducersMap {
        errors(state: ErrorsState | undefined, action: ErrorsActions): ErrorsState;
    }

    interface StoreActionsMap {
        errors: ErrorsActions;
    }
}
