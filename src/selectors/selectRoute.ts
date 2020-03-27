import { createSelector, Selector } from 'reselect';

import { AppRoute } from '../components/lit-router/types';

export const selectRoute: Selector<StoreState, AppRoute | undefined> = createSelector(
    (state: StoreState) => state.app.route,
    (r?: AppRoute): AppRoute | undefined => {
        return r;
    },
);
