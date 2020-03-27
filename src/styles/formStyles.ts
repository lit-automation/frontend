import { css, CSSResult } from 'lit-element';

import { preventUserSelect } from './preventUserSelect';

export const formStyles: CSSResult = css`
    label {
        display: inline-block;
        color: var(--primary-blue-80);
        cursor: pointer;
        font-weight: var(--font-weight-semibold);
        user-select: none;
        padding: 10px 0px;
        margin-bottom: 1px;

        ${preventUserSelect};
    }
    .input-field-box {
        display: flex;
        flex-wrap: wrap;
        margin-left: -12.5px;
        margin-right: -12.5px;
        margin-bottom: 12.5px;
        align-items: center;
        justify-content: space-between;
    }
    .input-field-box lit-input-field,
    .input-field-box .input-field {
        margin: 0px 12.5px 12.5px 12.5px;
    }
    .input-field-box:last-child lit-input-field,
    .input-field-box:last-child .input-field {
        margin-bottom: 0;
    }
    .input-field-box lit-input-field.flex-grow-50 {
        padding-right: 25px;
    }
    lit-input-field lit-button {
        margin-left: 15px;
        margin-right: 15px;
    }
    lit-input-field lit-button:first-child {
        margin-right: 0;
    }
    lit-input-field lit-button:last-child {
        margin-right: 0;
    }
`;
