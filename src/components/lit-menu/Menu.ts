import { css, CSSResult, customElement, html, LitElement, TemplateResult } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { goToRoute } from '../lit-router/goToRoute';

/**
 * Menu root component
 */
@customElement('lit-menu')
export class Menu extends connect(window.store)(LitElement) {
    static get styles(): CSSResult {
        return css`
            :host {
                display: flex;
                width:100%;
                height: 100%;
            }

            .menu{
                display:flex;
                width:100%;
                flex-direction:column;
                border-right: 2px solid var(--primary-grey-20);
                padding: 20px;
            }

            .menu-item{
                cursor: pointer;
                margin-top: 10px;
                padding: 5px;
                font-size: var(--font-size-16);
            }
        `;
    }

    @watch('selectedProject.busy')
    private retrievingSelectedProject: boolean = false;

    @watch('articles.busy')
    private retrievingArticles: boolean = false;

    public render = (): TemplateResult => html`
        <div class="menu">
            <a class="menu-item" @click="${(): void => {
                this.handleRouting('/');
            }}">
            Home
            </a>
            <a class="menu-item" @click="${(): void => {
                this.handleRouting('/articles');
            }}">
            Articles
            </a>
            <a class="menu-item" @click="${(): void => {
                this.handleRouting('/screen-abstract');
            }}">
            Screen abstracts
            </a>
            <a class="menu-item" @click="${(): void => {
                this.handleRouting('/screen-full-text');
            }}">
            Screen full text
            </a>
            <a class="menu-item" @click="${(): void => {
                this.handleRouting('/import');
            }}">
            Import
            </a>
            <a class="menu-item" @click="${(): void => {
                this.handleRouting('/graph');
            }}">
            Graph
            </a>
        </div>
    `

    private handleRouting = (route: string): void => {
        if(this.retrievingSelectedProject || this.retrievingArticles) {
            return;
        }
        goToRoute(route);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-menu': Menu;
    }
}
