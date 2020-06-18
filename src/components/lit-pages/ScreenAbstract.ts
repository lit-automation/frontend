import { css, CSSResult,customElement,html, LitElement, property, PropertyValues, TemplateResult } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { getProject } from '../../async-reducers';
import '../../elements/Button';
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
 * ScreenAbstract root component
 */
@customElement('lit-screen-abstract')
export class ScreenAbstract extends connect(window.store)(LitElement) {
    static get styles(): CSSResult {
        return css`
            :host {
                display: block;
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
                min-width: 130px;
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

            .loadingSpinnerContainer{
                width: inherit;
                flex-direction:row;
                justify-content: center;
                display: none;
            }

            #loadingSpinner{
                width: 540px;
                height: 360px;
            }


            :host([isLoading]) .loadingSpinnerContainer{
                display:flex;
            }

            :host([isLoading]) .screen-content{
                display:none;
            }

            .grow{
                flex-grow:1
            }


        `;
    }

    @property({ type: Object, reflect: true })
    public tfIDF?: ScreenDataAbstractTitle;

    @property({ type: Array, reflect: true })
    public artSentences?: ScreenData[];

    @property({ type: Boolean, reflect: true })
    public isLoading: boolean = false;

    @property({ type: String, reflect: true })
    public cudArtID?: string;

    @watch('selectedProject.data.id')
    private projectID?: string;

    @watch('selectedProject.data.name')
    private projectName?: string;

    private modelDetails?: any;

    constructor() {
        super();
    }

    public render = (): TemplateResult => html`

    <div class="container">
        <div class="row">
            <div class="row">
                <div class="header">
                Project:
                </div>
                <div>
                ${this.projectName}
                </div>
            </div>
            <div class="grow"></div>
            <lit-button class="button-margin" @click="${(): void => {
                this.autoScreen();
            }}">Auto Screen</lit-button>
        </div>
        <div class="loadingSpinnerContainer">
            <img id="loadingSpinner" src="assets/icons/loadingspinner.gif"/>
        </div>
        <div class="screen-content">
            <div class="column">
                ${this.createModelDetails(this.modelDetails)}
            </div>
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
        </div>
     </div>
     `

    protected readonly update = (changedProperties: PropertyValues): void => {
        console.log(changedProperties);
        console.log('hi');
        if(!this.tfIDF) {
            this.retrieveScreeningInfo();
        }
        super.update(changedProperties);
    }

    private createModelDetails = (data?: any): TemplateResult => {
        if(!data) {
            return html``;
        }

        return html`
            <div class="row">
                <div class="header">Screening model details:</div>
            </div>
            <div class="row">
                <div class="header">Auto included:</div><div>${data.auto_include}</div>
            </div>
            <div class="row">
                <div class="header">Auto excluded:</div><div>${data.auto_exclude}</div>
            </div>
            <div class="row">
                <div class="header">Percentage trained:</div><div>${Math.round((data.screened_articles/data.total_articles*100 + Number.EPSILON) * 100) / 100}%</div>
            </div>
        `;
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

    private retrieveScreeningInfo() {
        if (!this.projectID) {
            window.store.dispatch(getProject.run(''));
            return;
        }
        console.log('Retrieving');
        this.isLoading = true;
        fetch(window.API_LINK + '/project/' + this.projectID + '/screen/activelearning/abstract', {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json();
                this.tfIDF= this.screenDataScreenDataAbstractTitle({});
                if (response.detail) {
                    showNotification(response.detail);
                } else {
                    showNotification('Unable to retrieve screening info for article');
                }
            } else {
                let data = {
                    id: '',
                    tfidf: '',
                    model_details: {},
                    sentences: [],
                };
                try {
                    data = await resp.json();
                } catch (e) {
                    console.warn('EXCPETION', e);
                }
                this.modelDetails = data.model_details;
                this.cudArtID = data.id;
                this.tfIDF = this.screenDataScreenDataAbstractTitle(data.tfidf);
                this.artSentences = this.screenDataArrayConverter(data.sentences);
            }
            this.isLoading = false;
        });
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

    private screenDataScreenDataAbstractTitle = (x: any): ScreenDataAbstractTitle => {
        return x;
    }

    private screenDataArrayConverter = (x: any): ScreenData[] => {
        return x;
    }
    private include = (): void => {
        this.screen(true);
    }

    private exclude = (): void => {
        this.screen(false);
    }

    private screen = (include: boolean): void => {
        // if (!this.curArt) {
        //     return;
        // }
        console.log('INCLUDE',include,this.tfIDF);
        if (!this.projectID) {
            return;
        }
        const body = {
            include: include,
        };
        fetch(window.API_LINK + '/project/' + this.projectID + '/screen/' + this.cudArtID, {
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
                showNotification('Trained model with article');
                this.tfIDF = undefined;
                this.artSentences = undefined;
            }
        });
    }

    private autoScreen() {
        showNotification('Started auto screening please wait...');

        this.isLoading = true;
        fetch(window.API_LINK + '/project/'+this.projectID+'/screen/auto', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        }).then(async (resp) => {
            this.isLoading = false;
            if (resp.status !== 200) {
                const response = await resp.json();
                if (response.detail) {
                    showNotification(response.detail);
                } else {
                    showNotification('Unable to start automatic screening');
                }
            } else {
                showNotification('Finished auto screening!');
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-screen-abstract': ScreenAbstract;
    }
}
