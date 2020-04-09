import { Reducer } from 'redux';
import {
    SET_USER,
    SET_USER_IDS,
    UserActions,
} from '../actions/user';

export interface UserState {
    givenTo?: string;
    sub?: string;
}

const defaultState: UserState = {
    givenTo: undefined,
    sub: undefined,
};

export const user: Reducer<UserState, any> = (state: UserState = defaultState, action: UserActions): UserState => {
    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
            };
        }
        case SET_USER_IDS: {
            return {
                ...state,
                givenTo: action.givenTo,
                sub: action.sub,
            };
        }
        default: {
            return state;
        }
    }
};
