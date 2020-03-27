// @ts-ignore
import { getStateWith, registerSelectors } from 'reselect-tools';
import * as selectors from './selectors';

export function initReselect(): void {
    // Pass state function to reselect tools
    getStateWith(() => window.store.getState()); // tslint:disable-line: no-unsafe-any

    // Sets up a Chrome extension for selector debugging
    registerSelectors(selectors); // tslint:disable-line: no-unsafe-any
}
