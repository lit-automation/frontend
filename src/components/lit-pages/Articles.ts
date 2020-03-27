import { css, CSSResult, property, customElement, html, query, TemplateResult, PropertyValues, LitElement } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { ProjArticle } from '../../async-reducers'
import { getArticles, getProject } from '../../async-reducers'
import '../../elements/Button';
import { Button } from '../../elements/Button';

/**
 * Articles root component
 */
@customElement('lit-articles')
export class Articles extends connect(window.store)(LitElement) {
    static get styles(): CSSResult {
        return css`
            :host {
                display: block;
                height: 100%;
                width: 100%;
            }

            .content-container{
                padding: 20px;
            }

            .project-header-row {
                display:flex;
                flex-direction:row;
                margin-bottom: 10px;
            }

            .column{
                width: 150px;
                padding: 5px;
            }

            .medium{
                width: 350px;;   
            }

            .large{
                width: 350px;;   
            }

            .small{
                width: 50px;;   
            }

            .project-row {
                margin-top: 5px;
                display:flex;
                flex-direction:row;
            }

            .header{
                font-weight: bold;
            }

            .navigation{
                padding-left: 25px;
                padding-right: 25px;
                margin-top: 10px;
                flex-direction:row;
                display: flex;
            }

            .grow{
                flex-grow:1
            }

            .navigation-inner{
              
                flex-direction:row;
                display: flex;
            }

            .page-indicator{
                flex-direction:column;
                display:flex;
                justify-content: center;
                margin-right: 20px;
                margin-left: 20px;
                font-weight:bold;
            }

            .search-container {
                border: 1px solid red;
                height: 200px;
            }

            .articles-list-wrapper{
                width: 100%;
                max-height: 500px;
                overflow-y: auto;
            }

            lit-button{
                margin-right: 0px;
                margin-bottom: 0px;
            }
        `;
    }

    @watch('selectedProject.data.id')
    private projectID?: string;

    @watch('articles.data.list')
    private articles?: Array<ProjArticle>;

    @watch('articles.data.count')
    private amountOfArticles?: number;

    private curPage: number = 1;
    private minPage: number = 1;
    @property({ type: Number, reflect: true })
    private maxPage: number = 1;
    private perPage: number = 20;

    @query("#prev")
    private prevButton?: Button;

    @query("#next")
    private nextButton?: Button;

    private lastID: string = ''

    public render = (): TemplateResult => html`
    <div class="content-container">
    <div class="search-container">
    TODO search interface
    </div>
    <div class="project-header-row">
                <div class="large column header">
                    Title
                </div>
                <div class="column header">
                    Cited
                </div>
                <div class="column medium header">
                    DOI
                </div>
                <div class="column header">
                    Journal
                </div>
                <div class="column header">
                    Authors
                </div>
            </div>
            <div class="articles-list-wrapper">
                ${this.renderArticles()}
            </div>
         
            <div class="navigation">
                <lit-button @click="${(): void => {
            this.downloadArticles()
        }}">Download articles</lit-button>
                <div class="grow"></div>
                <div class="navigation-inner">
                    <lit-button id="prev" @click="${(): void => {
            this.prev()
        }}">Prev</lit-button>
                    <div class="page-indicator">${this.curPage}/${this.maxPage}</div>
                    <lit-button id="next" @click="${(): void => {
            this.next()
        }}">Next</lit-button>
                </div>
            </div>
    </div>`;

    constructor() {
        super();
    }

    private renderArticles() {
        if (!this.articles) {
            return html``
        }

        return this.articles.map((item) => html`
            <div class="project-row">
                <div class="column large">${item.title}</div>
                <div class="column">${this.citedToString(item.cited_amount)}</div>
                <div class="column medium">${item.doi}</div>
                <div class="column">${item.journal}</div>
                <div class="column">${item.authors}</div>
            </div>
            `)
    }


    private citedToString = (cited: number): string => {
        if (cited === -1) {
            return 'Unknown'
        }
        return String(cited)
    }

    private next = (): void => {
        if (this.curPage === this.maxPage) {
            return;
        }
        this.curPage++
        if (!this.projectID) {
            return;
        }
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1));
    }

    private prev = (): void => {
        if (this.curPage === this.minPage) {
            return;
        }
        this.curPage--
        if (!this.projectID) {
            return;
        }
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1));

    }

    private downloadArticles = async (): Promise<string> => {
        let response = await fetch(window.API_LINK + '/project/' + this.projectID + '/article/download', {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        })
        try {
            let blob = await response.blob()
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "filename.csv";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
        } catch (e) {
            console.warn("EXCPETION", e)
        }
        return ""
    }

    private setNavigation = (amountOfArticles: number): void => {
        if (amountOfArticles > 0) {
            this.maxPage = Math.ceil(amountOfArticles / this.perPage);
        } else {
            this.maxPage = 1;
            return
        }

        if (this.nextButton) {
            this.nextButton.disabled = false;
        }
        if (this.prevButton) {
            this.prevButton.disabled = false;
        }
        if (this.curPage === this.minPage) {
            if (this.prevButton) {
                this.prevButton.disabled = true;
            }
        }

        if (this.curPage === this.maxPage) {
            if (this.nextButton) {
                this.nextButton.disabled = true;
            }
        }
    }


    protected readonly update = (changedProperties: PropertyValues): void => {
        if (this.amountOfArticles) {
            this.setNavigation(this.amountOfArticles)
        }
        if (!this.articles) {
            this.retrieveInfo()
        } else if (changedProperties.has('projectID')) {
            this.retrieveInfo()
        }
        super.update(changedProperties);
    }


    protected retrieveInfo() {
        if (!this.projectID) {
            window.store.dispatch(getProject.run(''));
        } else if (this.projectID != this.lastID) {
            this.lastID = this.projectID
            window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1));
        }
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-articles': Articles;
    }
}
