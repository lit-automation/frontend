import { Constructor, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit-html';

const TYPES: unique symbol = Symbol('types');

/**
 * RegisteredSlot root component
 */
export abstract class RegisteredSlot<T extends Node> extends LitElement {
    @property()
    protected registered: T[] = [];

    private [TYPES]: Constructor<T>[];

    constructor(...t: Constructor<T>[]) {
        super();
        this[TYPES] = t;
    }

    /**
     * Render function
     */
    public render(): TemplateResult {
        return html`
            <slot @slotchange="${this.slotChangeHandler}"></slot>
        `;
    }

    protected slotChangeHandler = (): void => {
        if (this.shadowRoot) {
            const slot: HTMLSlotElement | undefined = this.shadowRoot.querySelectorAll('slot')[0];
            if (slot) {
                this.registered = <T[]>slot.assignedNodes().filter((el: Node) => this[TYPES].find((t: Constructor<T>) => el instanceof t));
            }
        }
    }
}
