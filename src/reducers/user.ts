import { Reducer } from 'redux';
import {
    SET_USER,
    SET_USER_IDS,
    UserActions,
} from '../actions/user';

// import { UserMessage } from 'lit-backend/client/account/user_pb';

export interface UserState {
    givenTo?: string;
    sub?: string;
    // userData?: UserMessage.AsObject;
}

const defaultState: UserState = {
    givenTo: undefined,
    sub: undefined,
    // userData: undefined,
};

export const user: Reducer<UserState, any> = (state: UserState = defaultState, action: UserActions): UserState => {
    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
                // userData: action.userData,
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
