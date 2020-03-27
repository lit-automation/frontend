import { customElement, html, LitElement } from 'lit-element';
import { TemplateResult } from 'lit-html';

interface StyleObject {
    [key: string]: string;
}

/**
 * StyleProvider root component
 */
@customElement('lit-style-provider')
export class StyleProvider extends LitElement {
    private readonly styleObject: StyleObject = {
        // Other styles
        '--black': '#252E34',
        '--black-08': 'rgba(37, 46, 52, 0.08)',
        '--black-10': 'rgba(37, 46, 52, 0.10)',
        '--black-20': 'rgba(37, 46, 52, 0.20)',
        '--light-gray': '#F0F2F3',
        '--transition-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        '--transition-ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        '--transition-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        '--transition-sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
        '--transition-duration-supershort': '100ms',
        '--transition-duration-shortest': '150ms',
        '--transition-duration-shorter': '200ms',
        '--transition-duration-short': '250ms',
        '--transition-duration-standard': '300ms',
        '--transition-duration-leaving-screen': '195ms',
        '--transition-duration-entering-screen': '225ms',
        '--transition-duration-complex': '375ms',
        '--box-shadow-5': '0px 5px 50px var(--black-08)',
        '--box-shadow-8': '0px 8px 40px var(--black-10)',
        '--border-radius': '5px',
        '--button-border-radius': '45px',
        '--border-color': 'var(--black-10)',
        '--divider-color': 'var(--light-gray)',
        '--white': '#FFFFFF',
        '--text-color-contrast': 'var(--white)',
        '--highlight-color': '#318FFF',
        '--highlight-color-00': 'rgba(49, 143, 255, 0.00)',
        '--highlight-color-contrast': 'var(--white)',

        // Color styles
        '--primary-white': '#FFFFFF',
        '--primary-black': '#000000',
        '--primary-blue-100': '#1B243D',
        '--primary-blue-80': '#495064',
        '--primary-blue-60': '#767C8B',
        '--primary-blue-40': '#A4A7B1',
        '--primary-blue-20': '#D1D3D8',
        '--primary-blue-10': '#E8E9EC',
        '--primary-blue-5': '#F4F4F5',
        '--primary-light-blue-100': '#61CCF2',
        '--primary-light-blue-80': '#93D5F2',
        '--primary-light-blue-60': '#ADDFF4',
        '--primary-light-blue-40': '#C8EAF8',
        '--primary-light-blue-20': '#E3F4FB',
        '--primary-light-blue-10': '#F1FAFD',
        '--secondary-red-100': '#E3262C',
        '--secondary-red-80': '#E95156',
        '--secondary-red-60': '#EE7D81',
        '--secondary-red-40': '#F4A8AB',
        '--secondary-red-20': '#F9D4D5',
        '--secondary-red-10': '#FCE8EA',
        '--secondary-green-100': '#34CA82',
        '--secondary-green-80': '#7BD2A1',
        '--secondary-green-60': '#97DDB9',
        '--secondary-green-40': '#B8E8D1',
        '--secondary-green-20': '#B8E8D1',
        '--secondary-green-10': '#EAF9F1',
        '--secondary-silver-100': '#999999',
        '--secondary-silver-80': '#AEAEAF',
        '--secondary-silver-60': '#C3C3C3',
        '--secondary-silver-40': '#D8D8D8',
        '--secondary-silver-20': '#EBEBEB',
        '--secondary-orange-100': '#E4863B',
        '--secondary-orange-80': '#E99F66',
        '--secondary-orange-60': '#EEB88F',
        '--secondary-orange-40': '#F3D0B6',
        '--secondary-orange-20': '#F9E8DB',
        '--secondary-orange-10': '#FDF2E8',
        '--primary-grey-20': '#DFE1E6',
        '--primary-grey-15': '#E4E6EB',
        '--primary-grey-10': '#E9EBF0',
        '--primary-background-color': '#F4F6F9',
        '--primary-background-color-50': 'rgba(244, 246, 249, 0.5)',
        '--stroke-color': '#DDDEE2',
        '--primary-light-blue-5': '#F7FDFE',

        // Font styles
        '--font-family': '\'Fira Sans\', sans-serif',
        '--letter-spacing': '0.01em',
        '--font-size-11': '11px',
        '--font-size-12': '12px',
        '--font-size-13': '13px',
        '--font-size-14': '14px',
        '--font-size-15': '15px',
        '--font-size-16': '16px',
        '--font-size-19': '19px',
        '--font-size-22': '22px',
        '--font-size-36': '36px',
        '--font-size-h1': '22px',
        '--font-size-h2': '19px',
        '--text-color': 'var(--primary-blue-60)',
        '--text-color-h1': 'var(--primary-blue-100)',
        '--text-color-h2': 'var(--primary-blue-20)',
        '--text-color-h3':'var(--primary-blue-60)',
        '--font-weight-normal': '400',
        '--font-weight-semibold': '500',
        '--font-weight-bold': '700',

        // Line Height
        '--line-height': '1.2',
        '--paragraph-line-height': '1.8',

        // Feedback styles
        '--warning-color': 'var(--secondary-red-100)',
        '--warning-color-contrast': 'var(--primary-white)',
        '--succes-color': 'var(--secondary-green-100)',
        '--succes-color-contrast': 'var(--primary-white)',

        // Layout
        '--sidebar-width': '248px',

        // Body styles
        'background-color': 'var(--background-color)',
        'color': 'var(--text-color)',
        'line-height': 'var(--line-height)',
        'font-family': 'var(--font-family)',
        'font-size': 'var(--font-size-14)',
        'letter-spacing': 'var(--letter-spacing)',
    };

    constructor() {
        super();

        this.setBodyStyleObject(this.styleObject);
    }

    /**
     * Render function
     */
    public render = (): TemplateResult => html`<slot></slot>`;

    private readonly setBodyStyleObject = (object: StyleObject): void => {
        Object.keys(object).forEach((k: string) => {
            window.document.body.style.setProperty(k, object[k]);
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-style-provider': StyleProvider;
    }
}
