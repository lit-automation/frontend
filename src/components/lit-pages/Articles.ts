import { css, CSSResult, property, customElement, html, query, TemplateResult, PropertyValues, LitElement } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { ProjArticle, ArticleTypeOptions, ArticleStatusOptions } from '../../async-reducers'
import { getArticles, getProject } from '../../async-reducers'
import '../../elements/Button';
import { Button } from '../../elements/Button';
import { Popup } from '../../elements/Popup';
import { showNotification } from '../../elements/Notification';

import '../../elements/InputField';
import '../../elements/Popup';
import '../../elements/Select';
import './ArticleEdit';
import './ArticleScreen';

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
                border-top: 2px solid var(--primary-grey-20);
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
                margin-bottom: 5px;
                display: flex;
                flex-direction: row;
            }

            .search-elem-wrapper{
                padding-left: 5px;
                padding-right: 5px;
            }

            .label {
                font-weight: bold;
                min-width: 50px;
            }

            .edit-button{
                cursor: pointer;
                width: 24px;
                height: auto;
                margin-left: 10px;

            }

            .addWrapper{
                padding: 25px;
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

    @query('#addTitle')
    private addTitleElem?: HTMLInputElement;

    @query('#addDOI')
    private addDOIElem?: HTMLInputElement;

    public params: string = "";

    @query('#editPopup')
    private popupElem?: Popup;

    @query('#addPopup')
    private addElem?: Popup;

    @query('#screenPopup')
    private screenElem?: Popup;

    @property({ type: Object, reflect: true })
    private curEdit?: ProjArticle;

    public render = (): TemplateResult => html`
    <lit-popup id="editPopup" >
        <div>
        ${this.renderEdit()}
        </div>
    </lit-popup>

    <lit-popup id="screenPopup" >
    <div>
        ${this.renderScreen()}
    </div>
    </lit-popup>

    <lit-popup id="addPopup" >
        <div class="addWrapper">
            <div class="row">
                <div class="label">title</div>
                <lit-input-field class="search-item" id="addTitle" placeholder="Title"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">DOI</div>
                <lit-input-field class="search-item" id="addDOI" name="doi" placeholder="DOI"></lit-input-field>
            </div>
             <lit-button @click="${(): void => {
                this.addArticle()
            }}">Add Article</lit-button>
        </div>
    </lit-popup>

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
                        .options="${ArticleTypeOptions}"
                ></lit-select>
            </div>
            <div class="search-elem-wrapper">
                <div class="label">Article status</div>
                <lit-select
                        placeholder="Article status"
                        eventName="status-changed"
                        .options="${ArticleStatusOptions}"
                ></lit-select>
            </div>
        </div>
    </div>
    <div class="row">
        <lit-button @click="${(): void => {
            this.addArticlePopup()
        }}">Add Article</lit-button>
        <div class="grow"></div>
        <div class="label">Displaying: ${this.amountOfArticles} articles</div>
    </div>
    <div class="project-header-row">
                <div class="large column header">
                    Title
                </div>
                <div class="column header">
                    Cited
                </div>
                <div class="column header">
                    DOI
                </div>
                <div class="column header">
                    Journal
                </div>
                <div class="column header">
                    Authors
                </div>
                <div class="column header">
                    Edit
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
        document.addEventListener('article-editted', this.articleUpdated);
        document.addEventListener('article-screened', this.articleScreened);
        

    }

    private renderEdit() {
        if (!this.curEdit) {
            return html``
        }
        return html`
            <lit-article-edit .projectID=${this.projectID} .curEdit=${this.curEdit}></lit-article-edit>
        `
    }

    private renderScreen() {
        if (!this.curEdit) {
            return html``
        }
        console.log("EDIT CHANGED",this.curEdit)
        return html`
            <lit-screen .projectID=${this.projectID} .curEdit=${this.curEdit}></lit-screen>
        `
    }

    private renderArticles() {
        if (!this.articles) {
            return html``
        }
        return this.articles.map((item): TemplateResult => {return html`
            <div class="project-row">
                <div class="column large">${item.title}</div>
                <div class="column">${this.citedToString(item.cited_amount)}</div>
                <div class="column">${item.doi}</div>
                <div class="column">${item.journal}</div>
                <div class="column">${item.authors}</div>
                <img class="edit-button" src="assets/icons/edit.svg" @click="${(): void => {
                this.articleDetails(item)
            }}"/>
            <img class="edit-button" src="assets/icons/screen.svg" @click="${(): void => {
                this.screenArticlePopup(item)
            }}"/>
            <img class="edit-button" id="globe" src="assets/icons/globe.svg" @click="${(): void => {
                this.goToHref(item)
            }}"/>
            </div>
            `})
    }

    private articleDetails(item: ProjArticle) {
        this.curEdit = item;
        if (this.popupElem) {
            this.popupElem.showPopup = true;
        }
    }

    private addArticlePopup(){
        if (this.addElem) {
            this.addElem.showPopup = true;
        }
    }

    private screenArticlePopup(item: ProjArticle){
        this.curEdit = item;
        if(this.screenElem){
            this.screenElem.showPopup = true;
        }
    }

    private addArticle(){
        let res = {
            title: "",
            doi: "",
        }
        if (this.addTitleElem && this.addTitleElem.value) {
            res.title = this.addTitleElem.value
        }
        if (this.addDOIElem && this.addDOIElem.value) {
            res.doi = this.addDOIElem.value
        }

        if(res.title === "" && res.doi === ""){
            showNotification("Atleast title or DOI need to be filled in.")
        }
        fetch(window.API_LINK + "/project/"+this.projectID+"/article", {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(res),
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json()
                if (response.detail) {
                    showNotification(response.detail)
                } else {
                    showNotification("Unable to add article")
                }
            } else {
                showNotification('Successfully added article')
                if (this.addTitleElem){
                    this.addTitleElem.value = ""
                }
                if (this.addDOIElem){
                    this.addDOIElem.value = ""
                }
                if (this.addElem) {
                    this.addElem.showPopup = false;
                }
            }
        })
    }

    private goToHref = (item: ProjArticle) => {
        if (!item.url || item.url == '') {
            window.open('https://scholar.google.com/scholar?q=' + encodeURI(item.title) + '&hl=en&as_sdt=0,5')
        } else {
            window.open(item.url, '_blank');
        }
    }

    private articleScreened = (): void => {
        if (this.popupElem) {
            this.popupElem.showPopup = false;
        }
        if (!this.projectID) {
            return;
        }
        if(!this.curEdit){
            return;
        }
        this.curEdit = undefined
      
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, this.params));

    }

    private articleUpdated = (): void => {
        if (this.popupElem) {
            this.popupElem.showPopup = false;
        }
        if (!this.projectID) {
            return;
        }
        if(!this.curEdit){
            return;
        }
        this.curEdit = undefined
      
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, this.params));

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
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, this.params));
    }

    private prev = (): void => {
        if (this.curPage === this.minPage) {
            return;
        }
        this.curPage--
        if (!this.projectID) {
            return;
        }
        window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, this.params));

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
            a.download = "article-export.csv";
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


    protected retrieveInfo = (): void =>{
        if (!this.projectID) {
            window.store.dispatch(getProject.run(''));
        } else if (this.projectID != this.lastID) {
            this.lastID = this.projectID
            window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, this.params));
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
            if (!this.projectID) {
                return
            }
            this.params = params.join("&")
            this.curPage = 1;
            window.store.dispatch(getArticles.run(this.projectID, this.curPage - 1, this.params));
        }, 200)
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-articles': Articles;
    }
}
