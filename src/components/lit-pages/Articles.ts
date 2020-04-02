import { css, CSSResult, property, customElement, html, query, TemplateResult, PropertyValues, LitElement } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { ProjArticle } from '../../async-reducers'
import { getArticles, getProject } from '../../async-reducers'
import '../../elements/Button';
import { Button } from '../../elements/Button';
import '../../elements/InputField';
import '../../elements/Select';
import { SelectOption } from '../../elements/Select';

const articleTypeOptions: SelectOption[] = [
    {
        value: 'none',
        text: 'None',
    },
    {
        value: 'book-chapter',
        text: 'Book',
    },
    {
        value: 'journal-article',
        text: 'Journal Article',
    },
    {
        value: 'proceedings-article',
        text: 'Conference Article',
    },
];

const articleStatusOptions: SelectOption[] = [
    {
        value: 'none',
        text: 'None',
    },
    {
        value: "1",
        text: 'Unprocessed',
    },
    {
        value: '2',
        text: 'Not Useful',
    },
    {
        value: '3',
        text: 'Useful',
    },
    {
        value: '4',
        text: 'Unknown',
    },
    {
        value: '5',
        text: 'Duplicate',
    },
];

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

            .row{
                margin-top: 10px;
                display: flex;
                flex-direction: row;
            }

            .search-elem-wrapper{
                padding-left: 5px;
                padding-right: 5px;
            }

            .label {
                font-weight: bold;
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

    @property({ type: Object })
    private articleSearchTimeout?: NodeJS.Timer;

    public articleType?: string;

    public articleStatus?: string;

    @query('#title')
    private titleElem?: HTMLInputElement;

    @query('#doi')
    private doiElem?: HTMLInputElement;

    @query('#abstract')
    private abstractElem?: HTMLInputElement;

    @query('#year')
    private yearElem?: HTMLInputElement;

    @query('#cites')
    private citesElem?: HTMLInputElement;

    public render = (): TemplateResult => html`
    <div class="content-container">
    <div class="search-container">
        <div class="header">
        Use the fields below to search through your articles
        </div>
        <div class="row">
            <div class="search-elem-wrapper">
                <div class="label">Title</div>
                <lit-input-field class="search-item" id="title" placeholder="Title" @keyup="${this.search}"></lit-input-field>
            </div>
            <div class="search-elem-wrapper">
                <div class="label">DOI</div>
                <lit-input-field class="search-item" id="doi" placeholder="DOI" @keyup="${this.search}"></lit-input-field>
            </div>
            <div class="search-elem-wrapper">
                <div class="label">Abstract</div>
                <lit-input-field class="search-item" id="abstract" placeholder="Abstract" @keyup="${this.search}"></lit-input-field>
            </div>
            <div class="search-elem-wrapper">
                <div class="label">Min Year</div>
                <lit-input-field class="search-item" id="year" placeholder="Minimum Year" type="number" @keyup="${this.search}"></lit-input-field>
            </div>
     
        </div>
        <div class="row">
            <div class="search-elem-wrapper">
                <div class="label">Min Cites</div>
                <lit-input-field class="search-item" id="cites" placeholder="Minimum Amount of cites" @keyup="${this.search}"></lit-input-field>
            </div>
            <div class="search-elem-wrapper">
                <div class="label">Article type</div>
                <lit-select
                        placeholder="Article type"
                        eventName="type-changed"
                        .options="${articleTypeOptions}"
                ></lit-select>
            </div>
            <div class="search-elem-wrapper">
                <div class="label">Article status</div>
                <lit-select
                        placeholder="Article status"
                        eventName="status-changed"
                        .options="${articleStatusOptions}"
                ></lit-select>
            </div>
        </div>
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
        document.addEventListener('type-changed', this.selectedTypeChanged);
        document.addEventListener('status-changed', this.selectedStatusChanged);

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
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, ''));
    }

    private prev = (): void => {
        if (this.curPage === this.minPage) {
            return;
        }
        this.curPage--
        if (!this.projectID) {
            return;
        }
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, ''));

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
            window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, ''));
        }
    }

    private selectedTypeChanged = (e: any): void => {
        if (e.detail.value === 'none') {
            this.articleType = undefined
        } else {
            this.articleType = e.detail.value
        }
        this.search()
    }

    private selectedStatusChanged = (e: any): void => {
        if (e.detail.value === 'none') {
            this.articleStatus = undefined
        } else {
            this.articleStatus = e.detail.value
        }
        this.search()
    }

    private search() {
        if (!this.titleElem) {
            return
        }
       
        if (this.articleSearchTimeout !== undefined) {
            clearTimeout(this.articleSearchTimeout);
        }

        this.articleSearchTimeout = setTimeout(() => {
            let params = []
            if (this.titleElem) {
                if (this.titleElem.value) {
                    params.push("title=" + this.titleElem.value)
                }
            }
            if (this.doiElem) {
                if (this.doiElem.value) {
                    params.push("doi=" + this.doiElem.value)
                }
            }
            if (this.yearElem) {
                if (this.yearElem.value) {
                    params.push("year=" + this.yearElem.value)
                }
            }
            if (this.abstractElem) {
                if (this.abstractElem.value) {
                    params.push("abstract=" + this.abstractElem.value)
                }
            }
            if (this.citesElem) {
                if (this.citesElem.value) {
                    params.push("amount_cited=" + this.citesElem.value)
                }
            }
            if (this.articleType) {
                params.push("type=" + this.articleType)
            }
            if (this.articleStatus) {
                params.push("status=" + this.articleStatus)
            }
            if(!this.projectID){
                return
            }
            window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, params.join("&")));
        }, 200)
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-articles': Articles;
    }
}
