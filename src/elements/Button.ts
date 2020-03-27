import { css, CSSResult, customElement, html, LitElement, property, SVGTemplateResult, TemplateResult } from 'lit-element';
import { preventUserSelect } from '../styles/preventUserSelect';

/**
 * Button root component
 */
@customElement('lit-button')
export class Button extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                display: inline-block;
                flex: none;
                border-radius: var(--button-border-radius);
                font-family: var(--font-family);
                font-weight: var(--font-weight-semibold);
                text-align: center;
                line-height: 48px;
                margin-right: 15px;
                margin-bottom: 15px;
                padding: 0 20px;
                min-width: 100px;
                box-sizing: border-box;
                cursor: pointer;

                --local-background-color: var(--primary-blue-100);
                --local-text-color: var(--primary-white);
                --local-font-size: var(--font-size-15);
                --local-border-color: transparent;
                --local-border-width: 2px;

                background-color: var(--local-background-color);
                color: var(--local-text-color);
                font-size: var(--local-font-size);
                border: var(--local-border-width) solid var(--local-border-color);

                transition:
                    color var(--transition-duration-shortest) ease-in-out,
                    background-color var(--transition-duration-shortest) ease-in-out,
                    opacity var(--transition-duration-shortest) ease-in-out,
                    border-color var(--transition-duration-shortest) ease-in-out;

                ${preventUserSelect};
            }
            :host(:hover) {
                opacity: .8;
            }
            :host(:last-of-type) {
                margin-right: 0;
                margin-bottom: 0;
            }

            /* Secondary Button Styling */
            :host([secondary]) {
                --local-background-color: var(--primary-light-blue-100);
            }
            :host([secondary][invert]) {
                --local-background-color: transparent;
                --local-text-color: var(--text-color);
                --local-border-color: var(--primary-blue-10);
                --local-border-width: 2px;
            }
            :host([secondary][invert][square]) {
                --local-border-width: 1px;
            }

            /* Tertiary Button Styling */
            :host([tertiary]) {
                --local-background-color: transparent;
                --local-text-color: var(--primary-blue-80);
                --local-border-color: var(--primary-blue-10);
            }
            :host([tertiary][invert]) {
                --local-background-color: transparent;
                --local-text-color: var(--text-color);
                --local-border-color: var(--primary-blue-80);
                --local-border-width: 1px;
            }

            /* Text Only Button Styling */
            :host([text-only]) {
                padding: 0;
                text-decoration: underline;
                --local-background-color: transparent;
                --local-text-color: var(--primary-blue-80);
            }
            :host([text-only][secondary]) {
                --local-text-color: var(--primary-light-blue-100);
            }
            :host([text-only][invert]) {
                --local-text-color: var(--primary-blue-20);
            }

            /* Small Button Styling */
            :host([small]) {
                line-height: 38px;
                --local-font-size: var(--font-size-14);
            }

            /* Disabled Button Styling */
            :host([disabled]) {
                cursor: not-allowed;
                opacity: .5;
            }

            :host([inherit-color]) {
                --local-text-color: inherit;
            }

            :host([square]) {
                border-radius: var(--border-radius);
            }
            :host([secondary][invert][square]),
            :host([tertiary][invert][square]) {
                --local-border-width: 1px;
            }

            .content {
                display: inline-flex;
                height: 100%;
                align-items: center;
            }

            :host([right]) .content {
                flex-direction: row-reverse;
            }

            svg {
                margin-right: 10px;
            }

            :host([right]) svg {
                margin-right: 0;
                margin-left: 10px;
            }

            svg .stroke {
                stroke: var(--local-text-color);
            }

            svg .fill {
                fill: var(--local-text-color);
            }
        `;
    }

    @property({ type: Object })
    public icon?: SVGTemplateResult;

    @property({ type: Boolean, reflect: true })
    public raised: boolean = true;

    @property({ type: Boolean, reflect: true })
    public disabled: boolean = false;

    public render = (): TemplateResult => html`
        <div class="content">
            ${this.icon}
            <slot></slot>
        </div>
    `
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-button': Button;
    }
}
