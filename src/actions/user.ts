import { Action } from 'redux';

export const PREFIX: string = 'User: ';

// import { UserMessage } from 'lit-backend/client/account/user_pb';

export interface SetUserAction extends Action<string> {
    // userData: UserMessage.AsObject;
}
export const SET_USER: string = `${PREFIX}SET_USER`;
export const setUser: ((
    // userData: UserMessage.AsObject,
) => SetUserAction) = (
    // userData: UserMessage.AsObject,
): SetUserAction => ({
    type: SET_USER,
    // userData,
});

export interface SetUserIdsAction extends Action<string> {
    givenTo: string;
    sub: string;
}
export const SET_USER_IDS: string = `${PREFIX}SET_USER_IDS`;
export const setUserIds: ((givenTo: string, sub: string) => SetUserIdsAction) = (
    givenTo: string,
    sub: string,
): SetUserIdsAction => ({
    type: SET_USER_IDS,
    givenTo,
    sub,
});

// Combined action interface for reducer
export interface UserActions extends SetUserAction, SetUserIdsAction {}
