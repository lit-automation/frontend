import { TemplateResult } from 'lit-element';
import { createSelector, Selector } from 'reselect';

export const selectSignInError: Selector<StoreState, TemplateResult[]> = createSelector(
    (state: StoreState) => state.errors.signin,
    (r: TemplateResult[]): TemplateResult[] => {
        return r;
    },
);

export const selectRegisternError: Selector<StoreState, TemplateResult[]> = createSelector(
    (state: StoreState) => state.errors.register,
    (r: TemplateResult[]): TemplateResult[] => {
        return r;
    },
);
