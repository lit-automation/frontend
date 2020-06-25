import { css, CSSResult, customElement, html, property, PropertyValues, TemplateResult } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { AppBaseRoute, AppRoute } from '../lit-router/types';

import '../../elements/Notification';
import '../../elements/StyleProvider';
import '../lit-create-signin/Signin';
import '../lit-header/Header';
import '../lit-menu/Menu';
import '../lit-pages/Articles';
import '../lit-pages/Graph';
import '../lit-pages/Home';
import '../lit-pages/Import';
import '../lit-pages/ScreenAbstract';
import '../lit-pages/ScreenFullText';
import { Router } from '../lit-router/Router';

/**
 * App root component
 */
@customElement('lit-app')
export class App extends connect(window.store)(Router) {
    static get routes(): AppBaseRoute[] | AppRoute[] {
        return [
            {
                path: '',
                children: [
                    {
                        path: '/',
                        component: 'lit-home',
                    },
                    {
                        path: '/articles',
                        component: 'lit-articles',
                    },
                    {
                        path: '/graph',
                        component: 'lit-graph',
                    },
                    {
                        path: '/import',
                        component: 'lit-import',
                    },
                    {
                        path: '/screen-abstract',
                        component: 'lit-screen-abstract',
                    },
                    {
                        path: '/screen-full-text',
                        component: 'lit-screen-full-text',
                    },
                ],
            },
        ];
    }

    static get styles(): CSSResult {
        return css`
            :host{
                --header-height: 60px;
                --menu-width: 200px;
            }

            :host([isAuthenticated]) .page-wrapper{
                display: flex;
            }

            :host([isAuthenticated]) .login-wrapper{
                display: none;
            }

            .login-wrapper{
                display: flex;
                height: calc(100vh - var(--header-height));
            }

            #router-outlet {
                display: block;
                width: calc(100vw - var(--menu-width));
                min-height: calc(100% - 94px); /* -94px: 55px margin-top from footer and 40px default margin */
                box-sizing: border-box;
            }
            #router-outlet > * {
                width: 100%;
            }

            .header{
                height: calc(var(--header-height) - 2px);
                border-bottom: 2px solid var(--primary-grey-20);
            }

            .menu-container{
                height: calc(100vh - var(--header-height));
                max-width: var(--menu-width);
                min-width: var(--menu-width);
            }

            .content-container{
                height: calc(100vh - var(--header-height) - 20px);
                width: calc(100vw - var(--menu-width));
                display: flex;
                overflow-y: auto;
                padding-bottom: 20px;
            }

            .page-wrapper{
                display:none;
                flex-direction:row;
            }
        `;
    }

    @property({ type: Boolean, reflect: true })
    public isAuthenticated: boolean = false;

    @watch('signin.jwt')
    private jwt?: string;

    constructor() {
        super();
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            this.jwt = jwt;
        }
    }

    public render = (): TemplateResult => {
        return html`
        <lit-style-provider>
            <lit-notification></lit-notification>
            <lit-header ?auth="${this.isAuthenticated}" class="header"></lit-header>
            <div class="login-wrapper">
                <lit-signin></lit-signin>
            </div>
            <div class="page-wrapper">
                <div class="menu-container">
                    <lit-menu></lit-menu>
                </div>
                <div class="content-container">
                    <div id="router-outlet"></div>
                </div>
           </div>
        </lit-style-provider>
    `;
    }

    public async connectedCallback(): Promise<void> {
        super.connectedCallback();
    }

    protected firstUpdated = (changedProperties: PropertyValues): void => {
        super.firstUpdated(changedProperties);
    }

    protected shouldUpdate = (changedProperties: PropertyValues): boolean => {
        if (this.jwt) {
            this.isAuthenticated = true;
        } else {
            this.isAuthenticated = false;
        }
        return super.shouldUpdate(changedProperties);
    }

    protected readonly updated = (changedProperties: PropertyValues): void => {
        super.updated(changedProperties);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-app': App;
    }
}
