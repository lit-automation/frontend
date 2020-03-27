import { css, CSSResult, customElement, html, LitElement, TemplateResult } from 'lit-element';

/**
 * Example root component
 */
@customElement('lit-example')
export class Example extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                display: block;
            }
        `;
    }

    public render = (): TemplateResult => html`<slot></slot>`;
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-example': Example;
    }
}
