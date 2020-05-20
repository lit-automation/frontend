import { css, property, PropertyValues, CSSResult, customElement, html, LitElement, TemplateResult } from 'lit-element';
import { ProjArticle } from '../../async-reducers'
import { showNotification } from '../../elements/Notification';

type ScreenData = {
    class: string
    confidence: number
    text: string
}
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
        `;
    }



    @property({ type: String, reflect: true })
    public projectID?: string;

    @property({ type: Object, reflect: true })
    public curEdit?: ProjArticle;

    @property({ type: Object, reflect: true })
    public artTitle?: ScreenData;

    @property({ type: Object, reflect: true })
    public artAbstract?: ScreenData;

    @property({ type: Array, reflect: true })
    public artSentences?: Array<ScreenData>;

    public prevID: string = "";

    public render = (): TemplateResult => {
        return html`
        <div class="row">
        <div class="header">Title</div>
        </div>
        <div class="row">
            ${this.createScreenData(this.artTitle)}
        </div>
        <div class="row">
        <div class="header">Abstract</div>
        </div>
        <div class="row">
            ${this.createScreenData(this.artAbstract)}
        </div>
        <div class="row">
        <div class="header">Sentences</div>
        </div>
        <div class="column">
            ${this.renderSentences(this.artSentences)}
        </div>
        <div class="row">
        <lit-button id="edit" @click="${(): void => {
                this.include()
            }}">Include</lit-button>
            <lit-button id="edit" @click="${(): void => {
                this.exclude()
            }}">Exclude</lit-button>
        </div>
        `
    }

    private renderSentences(sentences?: Array<ScreenData>) {
        if (!sentences) {
            return html``
        }

        return sentences.map((item): TemplateResult => {
            return html`
                ${this.createScreenData(item)}
            `
        })
    }

    private createScreenData = (data?: ScreenData): TemplateResult => {
        if (!data) {
            return html``
        }

        // 21, 231, 40 
        let color = data.confidence * 231
        let cssColor = "21, " + color + ", 40 "
        if (data.class === "Exclude") {
            cssColor = color + ", 21, 40"
        }
        let percent = (data.confidence * 100).toFixed(2)
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
            `
    }

    private retrieveScreeningInfo() {
        if (!this.curEdit) {
            return
        }
        if (!this.projectID) {
            return
        }
        console.log(this.curEdit.id)
        console.log(this.projectID)
        // {{backend_url}}/project/da69a44a-f022-46e1-ba88-a1e608793f14/screen/E5DE2564-6581-4194-881A-11B60A37970C
        fetch(window.API_LINK + "/project/" + this.projectID + "/screen/" + this.curEdit.id, {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json()
                console.log("Resp", response)
                if (response.detail) {
                    showNotification(response.detail)
                } else {
                    showNotification("Unable to retrieve screening info for article")
                }
            } else {
                console.log(resp)
                let data = {
                    title: "",
                    abstract: "",
                    sentences: [],
                }
                try {
                    data = await resp.json()
                } catch (e) {
                    console.warn("EXCPETION", e)
                }
                console.log(data)
                this.artTitle = this.screenDataConverter(data.title);
                this.artAbstract = this.screenDataConverter(data.abstract);
                this.artSentences = this.screenDataArrayConverter(data.sentences)
            }
        })
    }

    private screenDataArrayConverter = (x: any): Array<ScreenData> => {
        return x
    }

    private screenDataConverter = (x: any): ScreenData => {
        return x
    }

    private include = (): void => {
        this.screen(true)
    }

    private exclude = (): void => {
        this.screen(false)
    }

    private screen = (include: boolean): void => {
        if (!this.curEdit) {
            return
        }
        if (!this.projectID) {
            return
        }
        let body = {
            "include": include
        }
        fetch(window.API_LINK + "/project/" + this.projectID + "/screen/" + this.curEdit.id, {
            method: 'PUT',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(body),
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json()
                if (response.detail) {
                    showNotification(response.detail)
                } else {
                    showNotification("Unable to set screening inclusion/exclusion for article")
                }
            } else {
                showNotification('Adjusted article')
                const event: CustomEvent = new CustomEvent(`article-screened`, {
                    detail: {
                    },
                    bubbles: true,
                    composed: true,
                });
                document.dispatchEvent(event);
            }
        })
    }


    protected readonly update = (changedProperties: PropertyValues): void => {
        console.log("update")
        if(this.curEdit){
            if(this.prevID != this.curEdit.id){
                this.prevID = this.curEdit.id
            this.retrieveScreeningInfo()
            }
        }
        super.update(changedProperties);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-screen': ArticleScreen;
    }
}
