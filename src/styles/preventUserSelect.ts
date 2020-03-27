import { css, CSSResult } from 'lit-element';

export const preventUserSelect: CSSResult = css`
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;
