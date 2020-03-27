import { css, CSSResult, customElement, html,property, LitElement, TemplateResult } from 'lit-element';
import { goToRoute } from '../lit-router/goToRoute';

/**
 * Header root component
 */
@customElement('lit-header')
export class Header extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                display: flex;
            }

            .wrapper{
                width: 100%;
                display:flex;
                flex-direction:row;
            }

            .header-text{
                cursor: pointer;
                display: flex;
                font-size: var(--font-size-16);
                padding-left: 15px;
                align-items: center;
                justify-content: center;
            }

            .grow{
                flex-grow:1
            }

            .logout-button{
                display: none;
                cursor: pointer;
                padding-right: 15px;
                padding-left: 10px;
            }

            :host([auth]) .logout-button{
                display: flex;
            }

        `;
    }

    @property({ type: Boolean, reflect: true })
    public auth?: boolean;

    public render = (): TemplateResult => html`
        <div class="wrapper">
            <div class="header-text"><a @click="${(): void => {
            goToRoute('/');
        }}">Lit automation dashboard</a></div>
            <div class="grow"></div>
            <img class="logout-button" src="assets/icons/log-out.svg" @click="${(): void => {
            this.logout()
        }}">
        </div>
    `;

    private logout() {
        localStorage.clear()
        window.location.href = '/'
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-header': Header;
    }
}
