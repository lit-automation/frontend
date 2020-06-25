import { css, CSSResult, customElement, html, LitElement, TemplateResult } from 'lit-element';

/**
 * ScreeningExplanation root component
 */
@customElement('lit-screening-explanation')
export class ScreeningExplanation extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                overflow-y: auto;
                display: block;
                padding: 20px;
                max-width: 800px;
                max-height: 800px;
            }

            .header{
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 20px;
            }

            .row{
                margin-top: 10px;
                margin-bottom: 5px;
                display: flex;
                flex-direction: row;
            }

            .grow{
                flex-grow:1
            }
        `;
    }

    public render = (): TemplateResult => html`
    <div>
        <div class="row header">
        Screen abstract
        </div>
        <div class="row">
        <p>
        Before starting to screen at the <a href="/screen-abstract">abstract screening page</a> you'll need to initialize the model
        with atleast one included and one excluded article at the <a href="/articles">article overview page</a>. Based
        on verification done on screening data sets,
        we recommend to initialize the model with some additional included articles to reduce recall. Note that this also results
        in more incorrect results when starting to screen.
        When the model is initialized, it is recommended to screen 30% of the articles in your current set using
        the <a href="/screen-abstract">abstract screening page</a>, before letting the model automatically screen the remaining articles.
        <br/>
        <br/>
        Verification data of screening abstracts is shown in the image below.
        </p>
        </div>
        <div class="row">
        <div class="grow"></div>
        <img class="edit-button" id="globe" src="assets/images/AI_For_FinTech_Unbalanced_Set_Active_Learning.png"/>
        <div class="grow"></div>
        </div>
        <div class="row header">
        Screen full text
        </div>
        <div class="row">
        <p>
        As well as for screening on abstract, you'll need to initialize the model
        with atleast one included and one excluded article at the <a href="/articles">article overview page</a>.
        Afterwards, it is recommended to screen 50% of the articles using
        the <a href="/screen-full-text">full text screening page</a> before letting the model automatically screen the remaining articles.
        <br/>
        <br/>
        Verification data of screening full texts after screening on abstract is shown in the image below.
        </p>
        </div>
        <div class="row">
        <div class="grow"></div>
        <img class="edit-button" id="globe" src="assets/images/Full_Text_Screening_AI_For_FinTech_Unbalanced_Set.png"/>
        <div class="grow"></div>
        </div>
        </div>
    </div>
    `
}

declare global {
    interface HTMLElementTagNameMap {
        'lit-screening-explanation': ScreeningExplanation;
    }
}
