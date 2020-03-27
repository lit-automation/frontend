import { SVGTemplateResult } from 'lit-html';

export const svgToUrl: ((svg: SVGTemplateResult) => string) = (svg: SVGTemplateResult): string => {
    const result: RegExpExecArray | null = /^<svg>([^]*)<\/svg>$/.exec(svg.getHTML());

    if (result === null) {
        return '';
    }

    return `data:image/svg+xml;base64,${btoa(result[1])}`;
};
