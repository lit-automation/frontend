import { css, CSSResult, customElement, html, LitElement, PropertyValues, query, TemplateResult } from 'lit-element';
import { connect } from 'lit-redux-watch';
import { getProject } from '../../async-reducers';
import '../../elements/Button';
import '../../elements/InputField';
import { showNotification } from '../../elements/Notification';

/**
 * Import root component
 */
@customElement('lit-import')
export class Import extends connect(window.store)(LitElement) {
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

            .header{
                font-weight: bold;
                font-size: var(--font-size-16);
            }

            .outer-wrapper {
                margin-top: 10px;
                display:flex;
                direction: row;
            }

            .input-wrapper{
                width: 300px;
                display:flex;
                flex-direction:column;
            }


            .explanation{
                max-width: 300px;
                margin-left: 50px;
            }

            .import-elem{
                margin-top: 10px;
            }

            lit-button{
                margin-right: 0px;
                margin-bottom: 0px;
                width: 100%;
            }

            #file{
                display:none;
            }

            #file-label{
                width: 100%;
            }

            #upload-button{
                background-color: white;
                color: grey;
                border: 1px solid grey;
            }

            .exp-text{
                margin-top: 10px;
            }


        `;
    }

    @query('#projectName')
    public projectName?: HTMLInputElement;

    @query('#file')
    public fileContent?: any;

    constructor() {
        super();
    }

    public render = (): TemplateResult => html`
    <div class="content-container">
        <div class="header">CSV import</div>
        <div class="outer-wrapper">
            <div class="input-wrapper">
            <div class="header">Create project</div>
                <lit-input-field class="import-elem" id="projectName" placeholder="Project name"></lit-input-field>
                <input id="file"  type="file" />
                <label id=file-label" class="import-elem" for="file"><lit-button id="upload-button">Choose A file</lit-button></label>

                <lit-button class="import-elem" id="submit-button" @click="${(): void => {
                    this.createProject();
                }}">Import project</lit-button>
        </div>
        <div class="explanation">
        <div class="header">
        CSV upload explanation
        </div>
        <div class="exp-text">
        Use this form to create a project from an existing CSV file.
        The first row of your CSV should be indicating the column headers.
        Valid headers are: "title", "abstract", "full_text", "doi", "url", "year" & "status".
        <div>
        </div>
        Status is indicated by a number:
        <ul>
            <li>"Unprocessed" = 1</li>
            <li>"Excluded" = 2</li>
            <li>"Included on Abstract" = 3</li>
            <li>"Included" = 4</li>
            <li>"Duplicate" = 5</li>
            <li>"Unknown" = 6</li>
        </ul>
        </div>
        </div>
       </div>
        <div>
        </div>
    </div>`

    protected readonly firstUpdated = (changedProperties: PropertyValues): any => {
        super.firstUpdated(changedProperties);
    }

    private createProject = (): void => {
        if (!this.projectName?.value) {
            showNotification('No project name provided');
            return;
        }
        if (!this.fileContent?.value) {
            showNotification('No CSV file provided');
            return;
        }
        const fr = new FileReader();
        fr.readAsText(this.fileContent.files[0]);
        fr.onload = (evt) => {
            this.createProjectAPI({
                csv_content: evt.target?.result,
                name: this.projectName?.value,
            });
        };
        fr.onerror = (evt) => {
            console.log('Can\'t read file', evt);
        };
    }

    private createProjectAPI = (payload: Object): void => {
        fetch(window.API_LINK + '/project/csv', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(payload),
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json();
                if (response.detail) {
                    showNotification(response.detail);
                } else {
                    showNotification('Unable to create project from CSV');
                }
            } else {
                const response = await resp.json();
                window.store.dispatch(getProject.run(response.id));

                showNotification('Project created successfully');
                if (this.projectName) {
                    this.projectName.value = '';
                }
                if (this.fileContent) {
                    this.fileContent.value = '';
                }
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-import': Import;
    }
}
