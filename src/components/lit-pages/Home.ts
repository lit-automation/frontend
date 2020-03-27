import { css, CSSResult, customElement, html, LitElement, PropertyValues, TemplateResult } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { Project } from '../../async-reducers'
import { getProject, listProjects } from '../../async-reducers'
import '../../elements/Button';
import { projectStatus } from '../../enums'
/**
 * Home root component
 */
@customElement('lit-home')
export class Home extends connect(window.store)(LitElement) {
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
                font-size: var(--font-size-16);
            }

            .prop-row{
                margin-top: 5px;
                display:flex;
                flex-direction:row;
            }

            .attr{
                width: 200px;
            }

            .project-list-wrapper{
                width: 100%;
                max-height: 500px;
                overflow-y: auto;
            }

            .project-row {
                margin-top: 5px;
                display:flex;
                flex-direction:row;
            }

            .project-header-row {
                display:flex;
                flex-direction:row;
                margin-bottom: 10px;
            }

            .column{
                width: 150px;   
            }

            .wide-column{
                width: 250px;;   
            }

            .header{
                font-weight: bold;
            }

            .separator {
                margin-top: 40px;
            }
        `;
    }

    @watch('selectedProject.data')
    private project?: Project;

    @watch('projects.data')
    private projects?: Array<Project>;

    @watch('signin.jwt')
    private jwt?: string;

    @watch('selectedProject.busy')
    private retrievingSelectedProject: boolean = false;

    public render = (): TemplateResult => {
        return html`
        <div class="content-container">
            <div class="header">Selected Project</div>
            <div class="prop-row">
                <div class="attr">Name: </div>
                <div class="attr-val">${this.project ? this.project.name : ''}</div>
            </div>
            <div class="prop-row">
                <div class="attr">Search string: </div>
                <div class="attr-val">${this.project ? this.project.search_string : ''}</div>
            </div>
            <div class="prop-row">
                <div class="attr">Status: </div>
                <div class="attr-val">${this.project ? this.statusToString(this.project.status) : ''}</div>
            </div>
            <div class="prop-row">
                <div class="attr">Articles gathered:</div>
                <div class="attr-val">${this.project ? this.project.amount_of_articles : 0}</div>
            </div>
            <div class="separator"></div>
            <div class="header">Projects list</div>
            <div class="project-header-row">
                <div class="column header">
                    Name
                </div>
                <div class="column header">
                    Status
                </div>
                <div class="column header">
                    Articles gathererd
                </div>
                <div class="wide-column header">
                    Search string
                </div>
                <div class="column header">
                    Use Project
                </div>
            </div>
            <div class="project-list-wrapper">
                ${this.renderProjects()}
            </div>
        </div>
        
    `;
    }

    private renderProjects() {
        if (!this.projects) {
            return html``
        }
        return this.projects.map((item) => html`
                <div class="project-row">
                    <div class="column">${item.name}</div>
                    <div class="column">${this.statusToString(item.status)}</div>
                    <div class="column">${item.amount_of_articles}</div>
                    <div class="wide-column">${item.search_string}</div>
                    <div class="column">
                    <lit-button  class="button" @click="${(): void => {
                this.clickProject(item.id)
            }}">Use</lit-button>
                    </div>
                </div>

                `)
    }
    protected firstUpdated: (() => void) = (): void => {
        this.retrieveInfo()
    }

    constructor() {
        super();
        let jwt = localStorage.getItem('jwt')
        if (jwt) {
            if (!this.jwt) {
                this.jwt = jwt
            }
        }
    }

    private retrieveInfo: (() => void) = (): void => {
        if (!this.jwt) {
            return
        }
        if (!this.project) {
            window.store.dispatch(getProject.run(''));
        } else {
            window.store.dispatch(getProject.run(this.project.id));
        }
        window.store.dispatch(listProjects.run());
    }

    private statusToString = (status: number): string => {
        return projectStatus.Status[status - 1]
    }

    protected clickProject = (id: string): void => {
        if(this.retrievingSelectedProject){
            return
        }
        window.store.dispatch(getProject.run(id));
    }

    protected readonly update = (changedProperties: PropertyValues): void =>{
        if(!this.project){
            this.retrieveInfo()
        }
        super.update(changedProperties)
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-home': Home;
    }
}
