import { css, CSSResult, customElement, property, html, LitElement, TemplateResult } from 'lit-element';

/**
 * Notification root component
 */
@customElement('lit-notification')
export class Notification extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                z-index: 999999999999;
                width: 100%;
                position: absolute;
                color: var(--primary-white);
                transform: translateY(-100px);
                transition: transform var(--transition-duration-complex);
            }

            :host([show]) {
                transform: translateY(20px);
                transition: transform var(--transition-duration-complex);
            }

            .message-container{
                display: flex;
                justify-content: center;
            }

            .message-wrapper{
                display: flex;
                justify-content: center;
                min-width: 50vw;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 20px;
                padding-right: 20px;
                background-color: var(--primary-blue-100);
                border-radius: var(--button-border-radius);
            }
        `;
    }

    constructor() {
        super();
        document.addEventListener('show-notification', this.showNotification as EventListener);
    }

    @property({ type: String, reflect: true })
    public message?: string;

    @property({ type: Boolean, reflect: true })
    public show?: boolean;

    public render = (): TemplateResult => html`
        <div class="message-container">
            <div class="message-wrapper">
            ${this.message}
            </div>
        </div>
    `;

    public showNotification = (e: CustomEvent): void => {
        if(this.show){
            return;
        }
        this.message = e.detail.value;
        this.show = true;
        setTimeout(() => {
            this.show = false;
            this.message = ''
        }, 8000)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-notification': Notification;
    }
}

export const notificationEvent: ((message: string) => CustomEvent) = (message: string): CustomEvent => {
    return new CustomEvent('show-notification', {
        detail: {
            value: message
        },
        bubbles: true,
    });
};

export const showNotification: ((message: string) => void) = (message: string): void =>{
    document.dispatchEvent(notificationEvent(message))
}

