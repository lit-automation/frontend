import { TemplateResult } from 'lit-element';
import { Action } from 'redux';

export const PREFIX: string = 'Errors: ';

// SIGN IN ERROR
export interface SetErrorsSignInErrorAction extends Action<string> {
    signin: TemplateResult[];
}
export const SET_ERRORS_SIGN_IN_ERROR: string = `${PREFIX}SET_ERRORS_SIGN_IN_ERROR`;
export const setErrorsSignInError: ((signin: TemplateResult[]) => SetErrorsSignInErrorAction) = (
    signin: TemplateResult[],
): SetErrorsSignInErrorAction => ({
    type: SET_ERRORS_SIGN_IN_ERROR,
    signin,
});



// Combined action interface for reducer
export interface ErrorsActions extends SetErrorsSignInErrorAction {}
