import { css, CSSResult } from 'lit-element';

export const flexStyles: CSSResult = css`
    .flex {
        display: flex;
    }
    .flex.space-between {
        justify-content: space-between;
    }
    .flex-item {
        flex: 1;
    }
    .flex-grow-50 {
        flex-grow: 0.5;
    }
`;
