import { setAppRoute } from '../../actions/app';
import { AppRouter, AppRouterInterface } from './types';

export const goToRoute: ((path: string) => void) = (path: string): void => {
    const router: AppRouterInterface | undefined = window.store.getState().app.router;

    if (!router) {
        console.warn("cant go to route")
        return;
    }

    router.resolve(path).then((appRouter: AppRouter): void => {
        if (appRouter.route === undefined) {
            return;
        }

        window.store.dispatch(setAppRoute(appRouter.route, path));
    }).catch();
};
