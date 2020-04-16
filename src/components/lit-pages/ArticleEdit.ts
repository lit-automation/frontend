import { css, CSSResult, query, property, customElement, html, LitElement, TemplateResult } from 'lit-element';
import { ProjArticle, ArticleTypeOptions, ArticleStatusOptions } from '../../async-reducers'
import { showNotification } from '../../elements/Notification';

/**
 * ArticleEdit root component
 */
@customElement('lit-article-edit')
export class ArticleEdit extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                padding-top: 25px;
                padding-bottom: 25px;
                display: block;
                margin-left: 40px;
                margin-right: 40px;
            }

            .row{
                margin-top: 10px;
                display: flex;
                flex-direction: row;
            }

            .label {
                width: 150px;
                vertical-align: middle;
                line-height: 1.5;
                display: inline-block;
                margin-right: 25px;
                font-weight: bold;
            }

        `;
    }

    @property({ type: String, reflect: true })
    public projectID?: string;

    @property({ type: Object, reflect: true })
    public curEdit?: ProjArticle;

    @query('#title')
    private titleElem?: HTMLInputElement;
    @query('#abstract')
    private abstractElem?: HTMLInputElement;
    @query('#doi')
    private doiElem?: HTMLInputElement;
    @query('#cited')
    private citedElem?: HTMLInputElement;
    @query('#year')
    private yearElem?: HTMLInputElement;
    @query('#url')
    private urlElem?: HTMLInputElement;
    @query('#journal')
    private journalElem?: HTMLInputElement;
    @query('#publisher')
    private publisherElem?: HTMLInputElement;
    @query('#authors')
    private authorsElem?: HTMLInputElement;
    @query('#comment')
    private commentElem?: HTMLInputElement;

    constructor() {
        super();
        document.addEventListener('type-changed-edit', this.selectedTypeChanged);
        document.addEventListener('status-changed-edit', this.selectedStatusChanged);
    }

    public render = (): TemplateResult => {
        if (!this.curEdit) {
            return html``
        }
        let temp = JSON.stringify(this.curEdit);
        this.curEdit = undefined;
        this.curEdit = JSON.parse(temp);
        if (!this.curEdit) {
            return html``
        }
        return html`
            <div class="row">
                <div class="label">Title</div>
                <lit-input-field class="edit-item" value="${this.curEdit.title}" id="title" placeholder="Title"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Article status</div>
                <lit-select
                        selected="${this.curEdit.status}"
                        placeholder="Article status"
                        eventName="status-changed-edit"
                        .options="${ArticleStatusOptions}"
                ></lit-select>
            </div>
            <div class="row">
                <div class="label">Abstract</div>
                <lit-input-field class="edit-item" textarea .value="${this.curEdit.abstract}" id="abstract" placeholder="Abstract"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">DOI</div>
                <lit-input-field class="edit-item" value="${this.curEdit.doi}" id="doi" placeholder="DOI"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">CitedAmount</div>
                <lit-input-field class="edit-item" value="${this.curEdit.cited_amount}" id="cited" placeholder="Amount cited"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Year</div>
                <lit-input-field class="edit-item" value="${this.curEdit.year}" id="year" placeholder="Year"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">URL</div>
                <lit-input-field class="edit-item" value="${this.curEdit.url}" id="url" placeholder="URL"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Journal</div>
                <lit-input-field class="edit-item" value="${this.curEdit.journal}" id="journal" placeholder="Journal"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Publisher</div>
                <lit-input-field class="edit-item" value="${this.curEdit.publisher}" id="publisher" placeholder="Publisher"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Authors</div>
                <lit-input-field class="edit-item" .value="${this.curEdit.authors}" id="authors" placeholder="Authors"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Comment</div>
                <lit-input-field class="edit-item" textarea value="${this.curEdit.comment}" id="comment" placeholder="Comment"></lit-input-field>
            </div>
            <div class="row">
                <div class="label">Article type</div>
                <lit-select
                        placeholder="Article type"
                        eventName="type-changed-edit"
                        .options="${ArticleTypeOptions}"
                ></lit-select>
            </div>
           <div class="row">
            <lit-button id="edit" @click="${(): void => {
                this.edit()
            }}">Edit</lit-button>
            </div>
        `;
    }

    private selectedTypeChanged = (e: any): void => {
        if (!this.curEdit) {
            return
        }
        if (e.detail.value === 'none') {
            this.curEdit.type = 'none'
        } else {
            this.curEdit.type = e.detail.value
        }
    }

    private selectedStatusChanged = (e: any): void => {
        if (!this.curEdit) {
            return
        }
        let status = parseInt(e.detail.value)
        if(isNaN(status)){
            return
        }
        this.curEdit.status = status
    }

    private edit = (): void => {
        if (!this.curEdit) {
            return
        }
        if (this.titleElem && this.titleElem.value) {
            this.curEdit.title = this.titleElem.value
        }
        if (this.abstractElem && this.abstractElem.value) {
            this.curEdit.abstract = this.abstractElem.value
        }
        if (this.doiElem && this.doiElem.value) {
            this.curEdit.doi = this.doiElem.value
        }
        if (this.citedElem && this.citedElem.value) {
            let cited = parseInt(this.citedElem.value)
            if(!isNaN(cited)){
                this.curEdit.cited_amount = cited
            }
        }
        if (this.yearElem && this.yearElem.value) {
            let year = parseInt(this.yearElem.value)
            if(!isNaN(year)){
                this.curEdit.year = year
            }
        }
        if (this.urlElem && this.urlElem.value) {

            this.curEdit.url = this.urlElem.value
        }
        if (this.journalElem && this.journalElem.value) {
            this.curEdit.journal = this.journalElem.value
        }
        if (this.publisherElem && this.publisherElem.value) {
            this.curEdit.publisher = this.publisherElem.value
        }
        if (this.authorsElem && this.authorsElem.value) {
            this.curEdit.authors = this.authorsElem.value
        }
        if (this.commentElem && this.commentElem.value) {
            this.curEdit.comment = this.commentElem.value
        }

        fetch(window.API_LINK + "/project/"+this.projectID+"/article/"+this.curEdit.id, {
            method: 'PUT',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(this.curEdit),
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json()
                if (response.detail) {
                    showNotification(response.detail)
                } else {
                    showNotification("Unable to edit article")
                }
            } else {
                showNotification('Successfully updated article')
                const event: CustomEvent = new CustomEvent(`article-editted`, {
                    detail: {
                    },
                    bubbles: true,
                    composed: true,
                });
                document.dispatchEvent(event);
            }
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-article-edit': ArticleEdit;
    }
}
