import { css, CSSResult } from 'lit-element';

export const sharedStyles: CSSResult = css`
    lit-inside-panel:not(:last-child),
    article:not(:last-child) {
        margin-bottom: 40px;
    }
    h1,
    h2,
    h3,
    p {
        margin: 0;
    }
    h1:not(:last-child),
    h2:not(:last-child),
    h3:not(:last-child),
    p:not(:last-child) {
        margin-bottom: 15px;
    }
    h1,
    h2 {
        font-weight: var(--font-weight-bold);
    }
    h1 {
        color: var(--text-color-h1);
        font-size: var(--font-size-22);
    }
    h1.large {
        font-size: var(--font-size-36);
    }
    h2 {
        color: var(--text-color-h2);
        font-size: var(--font-size-19);
    }
    h3 {
        color: var(--text-color-h3);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-semibold);
    }
    p {
        line-height: var(--paragraph-line-height);
    }
    small {
        font-size: var(--font-size-12);
        color: var(--primary-blue-40);
    }
    ul {
        padding-left: 2rem;
        margin: 20px 0 25px 0;
        list-style: none;
        text-align: left;
    }
    ul li {
        margin-bottom: 25px;
    }
    ul li:last-child {
        margin-bottom: 0;
    }
    ul:last-child {
        margin-bottom: 0;
    }
    ul li:before {
        color: var(--primary-blue-20);
        content: '\\2022';
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
        transform-origin: center;
        transform: scale(2);
        pointer-events: none;
    }

    .error {
        color: var(--secondary-red-80);
        margin-bottom: 25px;
    }
    .error a {
        color: inherit;
    }
    .error:last-child {
        margin-bottom: 0;
    }
`;
