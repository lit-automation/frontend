import { css, CSSResult, query, PropertyValues, customElement, html, LitElement, TemplateResult } from 'lit-element';
import { connect, watch } from 'lit-redux-watch';
import { getProject } from '../../async-reducers'
import { showNotification } from '../../elements/Notification';

/**
 * Graph root component
 */
@customElement('lit-graph')
export class Graph extends connect(window.store)(LitElement) {
    static get styles(): CSSResult {
        return css`
            .content-container{
                overflow-y: auto;
                padding: 20px;
                width: calc(100% - 40px);
                height: calc(100% - 40px);
                max-height: calc(100% - 40px);
                position: relative;
            }

            a{
                color: var(--primary-white)
            }

            #graph{
                overflow: hidden;
                position: relative;
                width: 100%;
                height: 100%;
            }

            #graph > svg {
                width: 100%;
                margin: 0;
                height: 100%;
            }

            .node-label {
                position: absolute;
                pointer-events: none;
                color: black;
                z-index: 100;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            #message {
                position: absolute;
                z-index: 1000;
                padding: 20px;
                border-radius: 15px;
                color: var(--primary-white);
                background-color: var(--primary-blue-100);
                transform: translateY(100vh);
                transition: transform var(--transition-duration-complex);
                display: flex;
                flex-direction:column;
            }

            .show-message {
                transform: translateY(50vh)!important;
                transition: transform var(--transition-duration-complex);
            }

            .property{ 
                font-weight: bold;
                width: 70px;
            }

            #discover{
                font-weight: bold;
            }

            .wrapper{
                display: flex;
                flex-direction: row;
            }

            .grow{
                flex-grow:1
            }

            .close-button{
                cursor: pointer;
                padding-bottom: 10px;
            }
        `;
    }
    constructor() {
        super();
        this.viva = require('vivagraphjs');
    }

    @query("#graph")
    private graphElem?: HTMLDivElement;

    private viva?: any;

    private domLabels: any;

    @watch('selectedProject.data.id')
    private projectID?: string;

    @query("#message")
    private messageElem?: HTMLDivElement;

    @query("#title")
    private titleElem?: HTMLDivElement;

    @query("#cited-amount")
    private citedElem?: HTMLDivElement;

    @query("#doi")
    private doiElem?: HTMLDivElement;

    @query("#url")
    private urlElem?: HTMLAnchorElement;

    @query("#discover")
    private discoverElem?: HTMLDivElement;

    public render = (): TemplateResult => html`

        <div class="content-container">
            <div id="message">
                <div class="wrapper">
                    <div class="grow"></div>
                    <img class="close-button" src="assets/icons/x.svg" @click="${(): void => {
            this.hideMessage()
        }}">
                </div>
                <div class="wrapper">
                    <div class="property">Title:</div>
                    <div id="title"></div>
                </div>
                <div class="wrapper">
                    <div class="property">Cited:</div>
                    <div id="cited-amount"></div>
                </div>
                <div class="wrapper">
                    <div class="property">DOI:</div>
                    <div id="doi"></div>
                </div>
                <div class="wrapper">
                    <div class="property">URL:</div>
                    <a id="url" target="_blank" ></a>
                </div>
                <div class="wrapper">
                    <div id="discover"></div>
                </div>
            </div>
            <div id="graph">
            </div>
        </div>
    `;

    private async getGraph() {
        let headers = window.STDHeaders
        let jwt = localStorage.getItem('jwt')
        if (!jwt) {
            console.warn("JWT NOT SET")
            return
        }
        if (!this.projectID) {
            console.warn("Project ID not set")
            return
        }
        headers.set('Authorization', jwt)

        let response = await fetch(window.API_LINK + '/project/' + this.projectID + '/graph', {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: headers,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        })
        let data = []
        try {
            data = await response.json()
        } catch (e) {
            console.warn("EXCPETION", e)
        }
        const input = []

        for (let i = 0; i < data.length; i++) {
            let curElem = data[i]
            let parentElem = {
                'id': curElem.id,
                'data': {
                    "url": curElem.url,
                    "article_id": curElem.article_id,
                    "cited_amount": curElem.cited_amount,
                    "title": curElem.title,
                    "doi": curElem.doi,

                },
                'children': new Array(),
            }
            if (curElem.children) {
                for (let j = 0; j < curElem.children.length; j++) {
                    let child = curElem.children[j]
                    if (child.id) {
                        parentElem.children.push(child.id)
                    }
                    input.push({
                        'id': child.id,
                        'data': {
                            "url": child.url,
                            "cited_amount": child.cited_amount,
                            "title": child.title,
                            "doi": child.doi,

                        },
                        'children': [],
                    })
                }
            }

            input.push(parentElem)
        }
        return input
    }

    private createGraph = (): void => {
        this.getGraph().then((res) => {
            this.createForInput(res)
        });
    }

    private createForInput = (input: any): void => {
        const graph = this.viva.Graph.graph();
        const container = this.graphElem;
        const layout = this.viva.Graph.Layout.forceDirected(graph, {
            springLength: 400,
            springCoeff: 0.0008,
            dragCoeff: 0.02,
            gravity: -1.2
        });
        for (let i = 0; i < input.length; i++) {
            graph.addNode(input[i].id, input[i].data);
        }
        let hasChildren = false;
        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < input[i].children.length; j++) {
                hasChildren = true
                // link two ids
                graph.addLink(input[i].id, input[i].children[j])
            }
        }
        if(!hasChildren){
            showNotification("Not seeing anything interesting? You probably didn't snowball your article set yet. If you just did, please give the backend some time to gather additional info.")
        }
        let maxLinks = 0
        graph.forEachNode((node: any) => {
            if (node.links && node.links.length > maxLinks) {
                maxLinks = node.links.length
            }
        })

        this.domLabels = this.generateDOMLabels(container, graph)
        const graphics = this.viva.Graph.View.webglGraphics();
        graphics.node((node: any) => {
            let percent = 0.2
            if (node.links) {
                percent = node.links.length / maxLinks
            }
            let nodeColor = "#00ff00"
            if (node.data.article_id) {
                nodeColor = "#2f4696"
            }
            return this.viva.Graph.View.webglSquare(percent * 100, nodeColor);
        }).placeNode((ui: any, pos: any) => {
            var domPos = {
                x: pos.x,
                y: pos.y
            };

            // And ask graphics to transform it to DOM coordinates:
            graphics.transformGraphToClientCoordinates(domPos);

            // then move corresponding dom label to its own position:
            var nodeId = ui.node.id;
            var labelStyle = this.domLabels[nodeId].style;
            labelStyle.left = domPos.x + 'px';
            labelStyle.top = domPos.y + 'px';
        });
        const renderer = this.viva.Graph.View.renderer(graph, {
            layout: layout,
            container: container,
            graphics: graphics
        });

        var events = this.viva.Graph.webglInputEvents(graphics, graph);

        events.click((node: any) => {
            if (this.messageElem) {
                this.messageElem.classList.add("show-message")
            }
            this.setDetails(node.data)
        });


        renderer.run();
    }

    private hideMessage = (): void => {
        if (this.messageElem) {
            this.messageElem.classList.remove("show-message")
        }
    }

    private setDetails(data: any) {
        if (this.titleElem) {
            this.titleElem.innerText = data.title
        }
        if (this.citedElem) {
            this.citedElem.innerText = data.cited_amount
        }
        if (this.doiElem) {
            this.doiElem.innerText = data.doi
        }
        if (this.urlElem) {
            this.urlElem.innerText = data.url
            this.urlElem.href = data.url
        }
        if (this.discoverElem) {
            if (data.article_id) {
                this.discoverElem.innerText = "This article was in the original set"
            } else {
                this.discoverElem.innerText = "This article was discovered during snowballing"
            }
        }
    }

    private generateDOMLabels = (container: any, graph: any): any => {
        // this will map node id into DOM element
        var labels = Object.create(null);
        graph.forEachNode((node: any) => {
            let label = document.createElement('div');
            label.classList.add('node-label');
            if (node.data.article_id) {
                label.innerText = "";
                label.id = node.id;
            }
            labels[node.id] = label;

            container.appendChild(label);
        });
        // NOTE: If your graph changes over time you will need to
        // monitor graph changes and update DOM elements accordingly
        return labels;
    }

    protected readonly update = (changedProperties: PropertyValues): void => {
        if (!this.projectID) {
            window.store.dispatch(getProject.run(''));
        } else {
            if (this.graphElem) {
                this.createGraph()
            } else {
                setTimeout(() => {
                    this.createGraph()
                }, 100)
            }
        }
        super.update(changedProperties)
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-graph': Graph;
    }
}
