import { css, CSSResult, property, customElement, html, LitElement, TemplateResult } from 'lit-element';

/**
 * Popup root component
 */
@customElement('lit-popup')
export class Popup extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 99;
                background-color: rgba(0, 0, 0, 0.8);
            }

            :host([showPopup]) {
                display: block;
            }

            #container{
                z-index: 999;
                width: 100%;
                overflow-y:auto;
                max-height: 90vh;
                background-color: white;
            }

            #col{
                max-height: 80vw;
            }

            #row {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }

            .close-button {
                width: 30px;
                height: 30px;
                position: absolute;
                right: 25px;
                top: 25px;
                cursor: pointer;
            }

        `;
    }
    @property({ type: Boolean, reflect: true })
    public showPopup: boolean = false;

    public render = (): TemplateResult => html`
    <img class="close-button" src="assets/icons/x.svg" @click="${(): void => {
            this.showPopup = false;
        }}">
        <div id="row" @mousedown="${(e: MouseEvent): void => {
            if (e.srcElement instanceof HTMLDivElement) {
                if (e.srcElement.id === 'row') {
                    this.showPopup = false;
                }
            }
        }}">
            <div id="col">
                <div id="container">
                    <slot></slot>
                </div>
            </div>
        </div>
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-popup': Popup;
    }
}
