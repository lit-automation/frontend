import {
    css,
    CSSResultArray,
    customElement,
    html,
    LitElement,
    property,
    PropertyValues,
    query,
    TemplateResult,
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { formStyles } from '../styles/formStyles';
import { preventUserSelect } from '../styles/preventUserSelect';
import { eye, eyeclosed } from './icons';

type InputTypeAttribute =
    'hidden' | 'text' | 'search' | 'tel' | 'url' | 'email' | 'password' | 'datetime' |
    'date' | 'month' | 'week' | 'time' | 'datetime-local' | 'number' | 'range' | 'color' |
    'radio' | 'file' | 'submit' | 'image' | 'reset' | 'button';

interface CustomEventTarget extends EventTarget {
    value: string;
}
interface InputChangedEvent extends CustomEvent {
    target: CustomEventTarget;
}
interface ValueChangedEvent extends CustomEvent {
    detail: { value: string };
}

/**
 * InputField root component
 */
@customElement('lit-input-field')
export class InputField extends LitElement {
    static get styles(): CSSResultArray {
        return [
            formStyles,
            css`
                :host {
                    position: relative;
                    display: block;
                    width: 100%;
                }

                label .required {
                    color: var(--warning-color)
                }
                .input-field-container {
                    display: flex;
                }
                .input-container {
                    position: relative;
                    display: flex;
                    width: 100%;
                    align-items: center;
                    min-width: 180px;
                    max-width: 100%;
                }
                :host([type="file"][multiline]) .input-container {
                    padding: 17px 17px 135px 17px;
                    border: 1px solid var(--primary-blue-10);
                    border-radius: var(--border-radius);
                    cursor: text;
                    transition: border-color var(--transition-duration-shortest) ease-in-out;
                }
                :host([type="file"][multiline]) .input-container:hover {
                    border-color:var(--primary-blue-20);
                }
                input,
                textarea {
                    background-color: var(--primary-white);
                    color: var(--primary-blue-80);
                    padding: 0 17px;
                    line-height: 50px;
                    width: 100%;
                    font-family: var(--font-family);
                    font-size: var(--font-size-14);
                    border: 1px solid var(--primary-blue-10);
                    border-radius: var(--border-radius);
                    outline: 0;
                    transition:
                        border-color var(--transition-duration-shortest) ease-in-out,
                        border-radius var(--transition-duration-shortest) ease-in-out;
                }
                input:hover,
                input:focus,
                input:active {
                    border-color: var(--primary-blue-20);
                }
                input[type="file"] {
                    display: none;
                }
                textarea {
                    padding: 17px;
                    min-height: 41px;
                    max-height: 240px;
                    resize: vertical;
                    line-height: 1.5;
                    transition: border-color var(--transition-duration-shortest) ease-in-out;
                }
                :host([type="file"][multiline]) textarea {
                    min-height: 69px;
                    padding: 0;
                    border: 0;
                    resize: none;
                }
                textarea:hover,
                textarea:focus,
                textarea:active {
                    border-color: var(--primary-blue-20);
                }
                textarea::-webkit-input-placeholder {
                    color: var(--primary-blue-80);
                    opacity: 0.3;
                    ${preventUserSelect};
                }
                textarea:-ms-input-placeholder {
                    color: var(--primary-blue-80);
                    opacity: 0.3;
                    ${preventUserSelect};
                }
                textarea::placeholder {
                    color: var(--primary-blue-80);
                    opacity: 0.3;
                    ${preventUserSelect};
                }
                .has-dropdown.dropdown-active input {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }
                input[type="password"] {
                    letter-spacing: 0.2em;
                }
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-calendar-picker-indicator {
                    display: none;
                    -webkit-appearance: none;
                }
                .icon-left ~ input {
                    padding-left: 46px;
                }
                .icon-left.tel ~ input {
                    padding-left: 150px;
                }
                .icon-right ~ input {
                    padding-right: 46px;
                }
                input::-webkit-input-placeholder {
                    letter-spacing: var(--letter-spacing);
                    color: var(--primary-blue-80);
                    opacity: 0.3;
                    ${preventUserSelect};
                }
                input:-ms-input-placeholder {
                    letter-spacing: var(--letter-spacing);
                    color: var(--primary-blue-80);
                    opacity: 0.3;
                    ${preventUserSelect};
                }
                input::placeholder {
                    letter-spacing: var(--letter-spacing);
                    color: var(--primary-blue-80);
                    opacity: 0.3;
                    ${preventUserSelect};
                }

                .icon-left,
                .icon-right {
                    position: absolute;
                    display: flex;
                    top: 0;
                    bottom: 0;
                    align-items: center;
                    z-index: 99;
                    ${preventUserSelect};
                }
                .icon-left {
                    left: 23px;
                    transform: translateX(-50%);
                }
                .icon-left.tel {
                    left: 47px;
                    border-right: 1px solid var(--primary-blue-10);
                }
                .icon-right {
                    right: 23px;
                    transform: translateX(50%);
                }
                .icon-left:not(.clickable),
                .icon-right:not(.clickable) {
                    pointer-events: none;
                }
                .icon-left.clickable svg,
                .icon-right.clickable svg {
                    cursor: pointer;
                    padding: 7px;
                    transition: opacity var(--transition-duration-shortest) ease-in-out;
                }
                .icon-left.clickable svg:hover,
                .icon-right.clickable svg:hover {
                    opacity: 0.5;
                }
                .icon-right.password.clickable svg {
                    opacity: .5;
                }
                .icon-right.password.clickable svg:hover {
                    opacity: 1;
                }

                .dropdown {
                    position: absolute;
                    background: var(--primary-white);
                    padding: 20px;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    border: 1px solid var(--primary-blue-10);
                    border-top: 0;
                    border-bottom-left-radius: var(--border-radius);
                    border-bottom-right-radius: var(--border-radius);
                    box-sizing: border-box;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity var(--transition-duration-shortest) ease-in-out;
                    z-index: 999;
                }
                .has-dropdown.dropdown-active .dropdown {
                    opacity: 1;
                    pointer-events: auto;
                }

                .calendar {
                    margin-top: 10px;
                    left: auto;
                    right: 0;
                    padding: 0;
                    width: auto;
                    border: 0;
                    border-radius: var(--border-radius);
                    box-shadow: 0px 15px 50px rgba(27, 36, 61, 0.1);
                }
                .calendar.open {
                    opacity: 1;
                    pointer-events: auto;
                }
            `,
        ];
    }

    @property({ type: String })
    public type: InputTypeAttribute = 'text';

    @property({ type: String })
    public inputType: InputTypeAttribute = 'text';

    @property({ type: String })
    public label: string = '';

    @property({ type: String })
    public name?: string;

    @property({ type: Boolean })
    public required: boolean = false;

    @property({ type: String })
    public placeholder: string = '';

    @property({ type: Number, reflect: true })
    public activeWalkthroughStep?: number;

    @property({ type: Number })
    public finalWalkthroughStep?: number;

    @query('#inputElement')
    public inputElement?: HTMLInputElement;

    @query('#textareaElement')
    public textareaElement?: HTMLInputElement;

    @property({ type: Boolean })
    public input: boolean = true;

    @property({ type: Boolean })
    public iconhide: boolean = false;

    @property({ type: Boolean })
    public active: boolean = false;

    @property({ type: String, reflect: true })
    public value: string = '';

    @property({ type: Boolean })
    public textarea: boolean = false;

    @property({ type: Number })
    public rows: number = 1;

    @property({ type: Boolean, reflect: true })
    public multiline: boolean = false;

    @property({ type: Boolean })
    public fileTypeMultiple?: boolean;

    @property({ type: Number })
    public fileTypeMaxFileSize?: number;

    @property({ type: Array })
    public fileTypeAcceptedFiles?: string[];

    @property({ type: Boolean })
    public fileTypeShowNote?: boolean;

    @query('.calendar')
    public calendar?: HTMLDivElement;

    @property({ type: Boolean })
    public passwordRating: boolean = false;

    constructor() {
        super();
        window.addEventListener('click', this.windowClicked);
    }

    /*
     * Render function
     */
    // tslint:disable-next-line:cyclomatic-complexity
    public render = (): TemplateResult => html`
        ${this.label ? html`
            <label for="inputElement">${this.label}${this.required ? html`
                <span class="required">*</span>
            ` : ''}</label>
        ` : ''}
        <div class="input-field-container" @click=${this.inputContainerClicked}>
            <div class="input-container${this.hasDropdownClass()}${this.dropdownActive()}">
                ${this.iconLeftMapper()}
                ${this.iconRightMapper()}
                ${(this.input && !this.textarea && !(this.type === 'file' && this.multiline)) ? html`
                    <input
                        id="inputElement"
                        type="${this.inputType}"
                        ?required="${this.required}"
                        .placeholder="${this.placeholder}"
                        @keydown="${this.inputChanged}"
                        @keyup="${this.inputChanged}"
                        @click="${this.setActive}"
                        @focusin="${this.focusIn}"
                        @focusout="${this.focusOut}"
                        value="${this.value}"
                        name="${ifDefined(this.name)}"
                    />
                ` : (this.textarea || (this.type === 'file' && this.multiline)) ? html`
                    <textarea
                        id="textareaElement"
                        type="${this.inputType}"
                        ?required="${this.required}"
                        @keydown="${this.inputChanged}"
                        @keyup="${this.inputChanged}"
                        @click="${this.setActive}"
                        @focusin="${this.focusIn}"
                        @focusout="${this.focusOut}"
                        .placeholder="${this.placeholder}"
                        rows="${this.rows}"
                        name="${ifDefined(this.name)}"
                    >${this.value}</textarea>
                ` : ''}
                ${this.type === 'date' ? html`
                    <div class="calendar dropdown" @mousedown="${this.calendarClicked}">
                     
                    </div>
                `: ''}
                <slot></slot>
                ${this.hasDropdown() ? html`
                    <div class="dropdown">
                        ${this.type === 'password' && this.passwordRating ? html`
                          
                        ` : ''}
                        ${this.type === 'search' ? html`
                            show search list items
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `

    public disconnectedCallback = (): void => {
        super.disconnectedCallback();
        window.removeEventListener('click', this.windowClicked);
    }

    public readonly windowClicked = (e: MouseEvent): void => {
        e.stopPropagation();
        this.active = false;

        if (this.calendar && this.type === 'date') {
            this.calendar.classList.remove('open');
        }
    }

    public readonly setActive = (): void => {
        const el: InputField = this;
        setTimeout(() => {
            el.active = true;
            this.focusInput();
        }, 0, el);
    }

    public readonly focusIn = (): void => {
        this.setActive();

        if (this.calendar && this.type === 'date') {
            this.calendar.classList.add('open');
        }
    }

    public readonly focusOut = (e: MouseEvent): void => {
        this.windowClicked(e);
    }

    public readonly focusInput = (): void => {
        let el: HTMLInputElement | undefined;

        if (this.inputElement) {
            el = this.inputElement;
        }
        if (this.textareaElement) {
            el = this.textareaElement;
        }

        if (el === undefined) {
            return;
        }

        this.active = true;

        el.focus();
    }

    public readonly inputContainerClicked = (): void => {
        this.focusInput();
    }

    protected updated = (changedProperties: PropertyValues): void => {
        super.updated(changedProperties);
        if (changedProperties.has('name')) {
            // tslint:disable-next-line:prefer-type-cast
            this.addEventListener(`${this.name}-value-changed`, this.valueChanged as EventListener);
        }
    }

    protected firstUpdated = (): void => {
        this.inputType = this.type;
    }

    private readonly calendarClicked = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        this.focusInput();
    }

    private readonly hasDropdown = (): boolean => {
        return ((this.type === 'password' && this.passwordRating) || this.type === 'search' || this.type === 'date');
    }

    private readonly hasDropdownClass = (): string => {
        return (this.hasDropdown()) ? ' has-dropdown' : '';
    }

    private readonly dropdownActive = (): string => {
        return (this.type !== 'date' && this.active && this.value !== '') ? ' dropdown-active' : '';
    }

    private readonly inputChanged = (e: InputChangedEvent): void => {
        if (e && e.target) {
            this.value = e.target.value;
        }
    }

    private readonly valueChanged = (e: ValueChangedEvent): void => {
        this.value = e.detail.value;
        if (this.value !== undefined && this.inputElement) {
            this.inputElement.value = this.value;
        }
    }

    private readonly iconLeftMapper = (): TemplateResult | undefined => {
        if (this.iconhide) {
            return undefined;
        }
        switch(this.type) {
            default:
                return undefined;
            case 'tel':
                return html`
                    <div class="icon-left tel clickable">
                    </div>
                `;
        }
    }

    private readonly iconRightMapper = (): TemplateResult | undefined => {
        switch(this.type) {
            default:
                return undefined;
            case 'password':
                return html`
                    <div
                        class="icon-right password clickable"
                        @mousedown="${this.toggleInputTypeTextPassword}"
                    >
                        ${this.inputType === 'password' ? html`
                            ${eyeclosed}
                        ` : html`
                            ${eye}
                        `}
                    </div>
                `;
        }
    }

    private readonly stopPropagation = (e: MouseEvent): void => {
        e.stopPropagation();
    }

    private readonly toggleInputTypeTextPassword = (e: MouseEvent): void => {
        this.stopPropagation(e);

        if (this.inputElement) {
            if (this.inputElement.getAttribute('type') === 'password') {
                this.inputType = 'text';
            } else if (this.inputElement.getAttribute('type') === 'text') {
                this.inputType = 'password';
            }
            setTimeout(() => {
                this.focusInput();
            }, 1);
        }
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-input-field': InputField;
    }
}