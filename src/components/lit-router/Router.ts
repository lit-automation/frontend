import { LitElement, property, PropertyValues ,query} from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { setAppRouter } from '../../actions/app';

import { goToRoute } from './goToRoute';

import { AppBaseRoute, AppRoute, AppRouter, AppRouterInterface, RouteChangeEvent, Routes } from './types';

/**
 * Router class
 */
export class Router extends connect(window.store)(LitElement) {
    static get routes(): AppBaseRoute[] | AppRoute[] {
        throw new Error(`Could not find static get routes() {}`);
    }

    @watch('app.route')
    public readonly routerAppRoute?: AppRoute;

    @watch('app.path')
    public readonly routerPath?: string;

    @watch('app.previousPath')
    public readonly routerAppPreviousPath?: string;

    @property({ type: Boolean })
    private enabledSetAppRoute: boolean = true;

    @query('#router-outlet')
    private readonly routerOutlet?: Element;

    @property({ type: Object })
    private router?: AppRouterInterface;

    constructor() {
        super();
        // tslint:disable-next-line:prefer-type-cast
        window.addEventListener('vaadin-router-location-changed', this.routerLocationChanged as EventListener);
    }

    
    protected firstUpdated(changedProperties: PropertyValues): void {
        super.firstUpdated(changedProperties);
        this.initRouter((<{constructor: {routes: AppBaseRoute[] | AppRoute[] }}><unknown>this).constructor.routes);
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);

        if (this.routerPath && this.routerAppRoute && changedProperties.has('routerPath')) {
            if (this.routerPath !== this.routerAppPreviousPath && this.routerPath !== window.location.pathname) {
                this.enabledSetAppRoute = false;
                AppRouter.go(this.routerPath);
            }
        }
    }

    protected readonly initRouter = (routes: AppBaseRoute[] | AppRoute[]): void => {
        if (!this.router && this.routerOutlet) {
            this.router = new AppRouter(this.routerOutlet);
            const newRoutes: Routes = this.router.getRoutes().concat(routes);
            this.router.setRoutes(newRoutes).catch((e: CustomEvent) => {
                console.warn('Someting went wrong while trying to add routes.', routes, e);
            });
            window.window.store.dispatch(setAppRouter(this.router));
        }
    }

    private readonly routerLocationChanged = (e: RouteChangeEvent): void => {
        const router: AppRouterInterface | undefined = this.router;

        if (router && this.enabledSetAppRoute) {
            goToRoute(e.detail.location.pathname);
        } else {
            this.enabledSetAppRoute = true;
        }
    }
}
