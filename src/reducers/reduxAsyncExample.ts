import { ReduxAsync } from '@weavedev/redux-async';

// : ReduxAsync<'start', 'callback', 'error', () => Promise<void>>

// tslint:disable-next-line:typedef
export const reduxAsyncExample = new ReduxAsync('start', 'callback', 'error', async (a: string): Promise<string> => {
    return `${a}`;
});

reduxAsyncExample.run('input');

// store.dispatch(reduxAsyncExample.run('input'));
