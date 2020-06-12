import { css, CSSResult, customElement, html, LitElement, property, PropertyValues, TemplateResult } from 'lit-element';
import { ProjArticle } from '../../async-reducers';
import { showNotification } from '../../elements/Notification';

type ScreenData = {
    class: string;
    confidence: number;
    text: string;
};

type ScreenDataAbstractTitle = {
    class: string;
    confidence: number;
    title: string;
    abstract: string;
};
/**
 * ArticleScreen root component
 */
@customElement('lit-screen')
export class ArticleScreen extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                width: 600px;
                display: block;
                padding: 20px;
                margin-left: 40px;
                margin-right: 40px;
            }

            .row{
                margin-top: 10px;
                margin-bottom: 5px;
                display: flex;
                flex-direction: row;
            }

            .column{
                flex-direction:column;
                display:flex;
            }

            .header{
                font-weight: bold;
            }

            .container{
                margin-left: 10px;
                margin-right: 10px;
            }

            lit-button{
                height: 52px;
            }

            #include{
                background-color: green;
            }

            #exclude{
                background-color: red;
            }
        `;
    }

    @property({ type: String, reflect: true })
    public projectID?: string;

    @property({ type: Object, reflect: true })
    public curEdit?: ProjArticle;

    // @property({ type: Object, reflect: true })
    // public artTitle?: ScreenData;

    @property({ type: Object, reflect: true })
    public tfIDF?: ScreenDataAbstractTitle;

    @property({ type: Array, reflect: true })
    public artSentences?: ScreenData[];

    public prevID: string = '';

    public render = (): TemplateResult => {
        return html`

        <div class="row">
            ${this.createScreenDataAbstractAndTitle(this.tfIDF)}
        </div>

        <div class="row">
        <div class="header">Sentences</div>
        </div>
        <div class="column">
            ${this.renderSentences(this.artSentences)}
        </div>
        <div class="row">
        <lit-button id="include" @click="${(): void => {
            this.include();
        }}">Include</lit-button>
            <lit-button id="exclude" @click="${(): void => {
                this.exclude();
            }}">Exclude</lit-button>
        </div>
        `;
    }

    protected readonly update = (changedProperties: PropertyValues): void => {
        if(this.curEdit) {
            if(this.prevID !== this.curEdit.id) {
                this.prevID = this.curEdit.id;
                this.retrieveScreeningInfo();
            }
        }
        super.update(changedProperties);
    }

    private renderSentences(sentences?: ScreenData[]) {
        if (!sentences) {
            return html``;
        }

        return sentences.map((item): TemplateResult => {
            return html`
                ${this.createScreenData(item)}
            `;
        });
    }

    private createScreenDataAbstractAndTitle = (data?: ScreenDataAbstractTitle): TemplateResult => {
        if (!data) {
            return html``;
        }

        const color = data.confidence * 231;
        let cssColor = '21, ' + color + ', 40 ';
        if (data.class === 'Exclude') {
            cssColor = color + ', 21, 40';
        }
        const percent = (data.confidence * 100).toFixed(2);
        return html`
        <div class="column">
        <div class="row">
            <div class="header">Class:</div><div class="container">${data.class}</div>
            <div class="header">Confidence:</div> <div class="container">${percent}%</div>
        </div>
        <div class="row">
            <div class="header">Title</div>
        </div>
        <div class="row" style="color:rgb( ${cssColor} )">
        <div>${data.title}</div>
        </div>
        <div class="row">
            <div class="header">Abstract</div>
        </div>
        <div class="row" style="color:rgb( ${cssColor} )">
        <div>${data.abstract}</div>
        </div>
        </div>
            `;
    }

    private createScreenData = (data?: ScreenData): TemplateResult => {
        if (!data) {
            return html``;
        }

        const color = data.confidence * 231;
        let cssColor = '21, ' + color + ', 40 ';
        if (data.class === 'Exclude') {
            cssColor = color + ', 21, 40';
        }
        const percent = (data.confidence * 100).toFixed(2);
        return html`
        <div class="row">
            <div class="column" style="color:rgb( ${cssColor} )">
                <div>${data.text}</div>
                <div class="row">
                    <div class="header">Class:</div><div class="container">${data.class}</div>
                    <div class="header">Confidence:</div> <div class="container">${percent}%</div>
                </div>
            </div>
        </div>
            `;
    }

    private retrieveScreeningInfo() {
        if (!this.curEdit) {
            return;
        }
        if (!this.projectID) {
            return;
        }
        fetch(window.API_LINK + '/project/' + this.projectID + '/screen/' + this.curEdit.id, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json();
                if (response.detail) {
                    showNotification(response.detail);
                } else {
                    showNotification('Unable to retrieve screening info for article');
                }
            } else {
                let data = {
                    tfidf: '',
                    sentences: [],
                };
                try {
                    data = await resp.json();
                } catch (e) {
                    console.warn('EXCPETION', e);
                }
                this.tfIDF = this.screenDataScreenDataAbstractTitle(data.tfidf);
                // this.artTitle = this.screenDataConverter(data.title);
                this.artSentences = this.screenDataArrayConverter(data.sentences);
            }
        });
    }

    private screenDataScreenDataAbstractTitle = (x: any): ScreenDataAbstractTitle => {
        return x;
    }

    private screenDataArrayConverter = (x: any): ScreenData[] => {
        return x;
    }

    // private screenDataConverter = (x: any): ScreenData => {
    //     return x;
    // }

    private include = (): void => {
        this.screen(true);
    }

    private exclude = (): void => {
        this.screen(false);
    }

    private screen = (include: boolean): void => {
        if (!this.curEdit) {
            return;
        }
        if (!this.projectID) {
            return;
        }
        const body = {
            include: include,
        };
        fetch(window.API_LINK + '/project/' + this.projectID + '/screen/' + this.curEdit.id, {
            method: 'PUT',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(body),
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json();
                if (response.detail) {
                    showNotification(response.detail);
                } else {
                    showNotification('Unable to set screening inclusion/exclusion for article');
                }
            } else {
                showNotification('Adjusted article');
                const event: CustomEvent = new CustomEvent(`article-screened`, {
                    detail: {
                    },
                    bubbles: true,
                    composed: true,
                });
                document.dispatchEvent(event);
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-screen': ArticleScreen;
    }
}
