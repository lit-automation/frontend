import { Action } from 'redux';

export const PREFIX: string = 'Authorization: ';

// REQUEST_SIGNIN
export interface RequestSigninAction extends Action<string> {
    email: string;
    password: string;
}
export const REQUEST_SIGNIN: string = `${PREFIX}REQUEST_SIGNIN`;
export const requestSignin: ((email: string, password: string) => RequestSigninAction) = (
    email: string,
    password: string,
): RequestSigninAction => ({
    type: REQUEST_SIGNIN,
    email,
    password,
});

// REQUEST_SIGNIN_SUCCES
export interface RequestSigninSuccesAction extends Action<string> {
    jwt: string;
    email: string;
}
export const REQUEST_SIGNIN_SUCCES: string = `${PREFIX}REQUEST_SIGNIN_SUCCES`;
export const requestSigninSucces: ((jwt: string, email: string) => RequestSigninSuccesAction) = (
    jwt: string,
    email: string,
): RequestSigninSuccesAction => ({
    type: REQUEST_SIGNIN_SUCCES,
    jwt,
    email,
});

// REQUEST_SIGNIN_FAILURE
export interface RequestSigninFailureAction extends Action<string> {
    error: string;
}
export const REQUEST_SIGNIN_FAILURE: string = `${PREFIX}REQUEST_SIGNIN_FAILURE`;
export const requestSigninFailure: ((error: string) => RequestSigninFailureAction) = (
    error: string,
): RequestSigninFailureAction => ({
    type: REQUEST_SIGNIN_FAILURE,
    error,
});

// Combined action interface for reducer
export interface SigninActions extends
    RequestSigninAction,
    RequestSigninSuccesAction,
    RequestSigninFailureAction {}
