import { css, CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import { formStyles } from '../styles/formStyles';
import { preventUserSelect } from '../styles/preventUserSelect';

import { arrowdown } from '../assets/icons/';

export interface SelectOption {
    value: string;
    content?: string | TemplateResult;
    text?: string;
}

/**
 * Select root component
 */
@customElement('lit-select')
export class Select extends LitElement {
    static get styles(): CSSResultArray {
        return [
            formStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                    min-width: 180px;
                    max-width: 100%;
                    box-sizing: border-box;

                    ${preventUserSelect};
                }

                :host(:not(:last-child)) {
                    margin-bottom: 30px;
                }

                :host([inline]) {
                    display: inline-block;
                    width: auto;
                    min-width: 0;
                }
                :host([inline]:not(:last-child)) {
                    margin-right: 15px;
                }

                :host([embedded]) {
                    min-width: 0;
                    border: 0;
                }

                :host([buttonstyle]) {
                    min-width: 130px;
                    max-width: auto;
                    width: auto;
                }

                select {
                    display: none;
                }

                .select {
                    position: relative;
                    line-height: 50px;
                    font-family: var(--font-family);
                    font-size: var(--font-size-14);
                    box-sizing: border-box;
                    cursor: pointer;
                }
                :host([buttonstyle]) .select {
                    line-height: 48px;
                }
                :host([buttonstyle][small]) .select {
                    line-height: 38px;
                }
                :host([buttonstyle]:not(:last-child)) .select {
                    margin-right: 15px;
                    margin-bottom: 15px;
                }
                :host([small]) .select {
                    line-height: 40px;
                }
                .select .selected {
                    display: flex;
                    background-color: var(--primary-white);
                    color: var(--primary-blue-80);
                    padding: 0 46px 0 17px;
                    height: 50px;
                    width: 100%;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--primary-blue-10);
                    box-sizing: border-box;
                    transition:
                        border-color var(--transition-duration-shortest) ease-in-out,
                        border-radius var(--transition-duration-shortest) ease-in-out;
                }
                :host(:not([buttonstyle])) .select:hover .selected {
                    border-color: var(--primary-blue-20);
                }
                :host([embedded]) .select .selected {
                    background-color: transparent;
                    border: 0;
                }
                :host([small]) .select .selected {
                    padding: 0px 34px 0px 12px;
                    height: 40px;
                }
                :host([buttonstyle]) .selected {
                    background-color: var(--primary-grey-10);
                    padding: 0 42px 0 15px;
                    height: auto;
                    width: auto;
                    border-radius: 25px;
                }
                :host([buttonstyle][small]) .selected {
                    border-radius: 20px;
                }
                :host(:not([buttonstyle])) .select.open .selected {
                    border-color: var(--primary-blue-20);
                }
                .select.open .selected,
                :host([buttonstyle]) .select.open .selected,
                :host([buttonstyle][small]) .select.open .selected {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }
                :host([buttonstyle][top]) .select.open .selected,
                :host([buttonstyle][small][top]) .select.open .selected {
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }
                :host([buttonstyle][top]) .select.open .selected {
                    border-bottom-left-radius: 25px;
                    border-bottom-right-radius: 25px;
                }
                :host([buttonstyle][small][top]) .select.open .selected {
                    border-bottom-left-radius: 20px;
                    border-bottom-right-radius: 20px;
                }
                .placeholder {
                    opacity: 0.3;
                }

                .arrow-down {
                    position: absolute;
                    right: 17px;
                }
                :host([top]) .arrow-down {
                    transform: scaleY(-1);
                }
                :host([small]) .arrow-down {
                    right: 12px;
                }
                .option-list {
                    position: absolute;
                    background-color: var(--primary-white);
                    color: var(--primary-blue-80);
                    left: 0px;
                    top: 49px;
                    min-width: 100%;
                    max-height: 225px;
                    -webkit-overflow-scrolling: touch;
                    opacity: 0;
                    pointer-events: none;
                    box-sizing: border-box;
                    overflow-x: hidden;
                    overflow-y: auto;
                    border: 1px solid var(--primary-blue-10);
                    border-bottom-left-radius: var(--border-radius);
                    border-bottom-right-radius: var(--border-radius);
                    transition:
                        opacity var(--transition-duration-shortest) ease-in-out;
                    z-index: 999;
                }
                :host([embedded]) .option-list {
                    top: 50px;
                    min-width: calc(100% + 1px);
                }
                :host([inline]) .option-list {
                    top: 39px;
                }

                :host([buttonstyle]) .option-list {
                    background-color: var(--primary-grey-10);
                    top: 42px;
                    border: 0;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    border-bottom-left-radius: 25px;
                    border-bottom-right-radius: 25px;
                }
                :host([buttonstyle][top]) .option-list {
                    top: auto;
                    bottom: 42px;
                    border-top-left-radius: 25px;
                    border-top-right-radius: 25px;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                }
                :host([buttonstyle][small]) .option-list {
                    top: 32px;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    border-bottom-left-radius: 20px;
                    border-bottom-right-radius: 20px;
                }
                :host([buttonstyle][small][top]) .option-list {
                    top: auto;
                    bottom: 32px;
                    border-top-left-radius: 20px;
                    border-top-right-radius: 20px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                .select.open .option-list {
                    opacity: 1;
                    pointer-events: auto;
                }
                .option-item {
                    padding: 0 17px;
                    white-space: nowrap;
                    border-left: 0 !important;
                    border-right: 0 !important;
                    transition:
                        color var(--transition-duration-supershort) ease-in-out,
                        background-color var(--transition-duration-supershort) ease-in-out;
                }
                :host(:not([buttonstyle])) .option-item {
                    border: 1px solid var(--primary-background-color);
                }
                :host(:not([buttonstyle])) .option-item:first-child {
                    border-top: 0;
                }
                :host(:not([buttonstyle])) .option-item:last-child {
                    border-bottom: 0;
                }
                :host(:not([buttonstyle])) .option-item:not(:first-child) {
                    margin-top: -1px;
                }
                :host(:not([buttonstyle])) .option-item.option-item_selected {
                    position: relative;
                    background-color: var(--primary-light-blue-5);
                    color: var(--primary-light-blue-100);
                    border-color: var(--primary-blue-10);
                    z-index: 2;
                }
                .option-item:hover {
                    background-color: var(--primary-light-blue-5);
                }
                :host([buttonstyle]) .option-item:hover {
                    background-color: var(--primary-grey-15);
                }
                .option-item.hidden {
                    display: none;
                }
                .option-item * {
                    pointer-events: none;
                }
                .select > .selected .placeholder-wrapper svg,
                .option-item > svg {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 15px 0 0;
                    border-radius: var(--border-radius);
                }
                .select > .selected .placeholder-wrapper svg:last-child,
                .option-item > svg:last-child {
                    margin: 0;
                }
            `,
        ];
    }

    @property({ type: Array })
    public options: SelectOption[] = [];

    @property({ type: String })
    public label?: string;

    @property({ type: String })
    public placeholder?: string;

    @property({ type: String })
    public selected?: string;

    @property({ type: String })
    public readonly eventName?: string;

    @property({ type: Boolean })
    public open: boolean = false;

    @property({ type: Boolean })
    public buttonstyle: boolean = false;

    constructor() {
        super();
        document.addEventListener('click', this.windowClicked);
    }

    public render = (): TemplateResult => html`
        ${this.label ? html`
            <label @click="${this.openSelect}">${this.label}</label>
        ` : ''}
        <div class="select ${classMap({ open: this.open })}">
            <div class="selected" @click="${this.toggleOpen}">
                <div class="placeholder-wrapper">
                    ${this.selected ? this.showSelected() : html`<span class="placeholder">${this.placeholder}</span>`}
                </div>
                <i class="arrow-down">${arrowdown}</i>
            </div>
            <div class="option-list">
                ${this.options.map((item: SelectOption) => html`
                    <div
                        class="
                            option-item
                            ${item.value === this.selected ? `
                                ${this.buttonstyle ? ' option-item_selected hidden' : ' option-item_selected'}
                            `: ''}
                        "
                        @click="${this.itemClicked}"
                        data-value="${item.value}"
                    >${this.showContent(item)}</div>
                `)}
            </div>
        </div>
        <select @change="${this.selectChange}">
            ${this.options.map((item: SelectOption) => html`
                <option ?selected="${item.value === this.selected}" value="${item.value}">${this.showContent(item)}</option>
            `)}
        </select>
    `

    public readonly showContent = (item: SelectOption): (string | TemplateResult | undefined) => {
        if (item.content) {
            return item.content;
        }
        if (item.text) {
            return item.text;
        }

        if (!item.text && !item.content) {
            return item.value;
        }

        return undefined;
    }

    public selectChange = (e: {target: {value: string}}): void => {
        if (e && e.target) {
            this.selectChangeEvent(e.target.value);
        }
    }

    public itemClicked = (e: MouseEvent): void => {
        e.stopPropagation();

        if (e && e.target) {
            const value: string = <string>(<HTMLDivElement>e.target).getAttribute('data-value');
            this.selectChangeEvent(value);
            this.open = false;
        }
    }

    public selectChangeEvent = (val: string): void => {
        if (this.eventName) {
            const event: CustomEvent = new CustomEvent(`${this.eventName}`, {
                detail: {
                    value: val,
                },
                bubbles: true,
                composed: true,
            });
            document.dispatchEvent(event);
        }
        this.selected = val;
        this.open = false;
    }

    public toggleOpen = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (!this.open) {
            const newEvent: Event = document.createEvent('Events');
            newEvent.initEvent('click', true, true);
            document.dispatchEvent(newEvent);
        }

        this.open = !this.open;
    }

    public openSelect = (e: MouseEvent): void => {
        e.stopPropagation();
        this.open = true;
    }

    public showSelected = (): (string | TemplateResult | undefined) => {
        const selectedOption: SelectOption | undefined = this.options.find((item: SelectOption) => item.value === this.selected);
        if (selectedOption !== undefined) {
            return this.showContent(selectedOption);
        } else {
            return '';
        }
    }

    public disconnectedCallback = (): void => {
        super.disconnectedCallback();
        window.removeEventListener('click', this.windowClicked);
    }

    private readonly windowClicked = (e: MouseEvent): void => {
        e.stopPropagation();
        this.open = false;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-select': Select;
    }
}
