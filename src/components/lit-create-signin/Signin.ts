import { css, CSSResult, customElement, html, query, LitElement, property, TemplateResult } from 'lit-element';
import { requestSignin } from '../../actions/authorization/signin';
import '../../elements/Button';
import '../../elements/InputField';
import { showNotification } from '../../elements/Notification';

/**
 * Signin root component
 */
@customElement('lit-signin')
export class Signin extends LitElement {
    static get styles(): CSSResult {
        return css`
            :host {
                display: flex;
                width: 100%;
            }

            .vertical-wrapper{
                width: 100%;
                height: 100%;
                flex-direction:column;
                display: flex;
                justify-content: center;
            }
            .horizontal-wrapper{
                flex-direction:row;
                display: flex;
                justify-content: center;
            }

            .signin-wrapper{
                min-width: 230px;
                display: flex;
                flex-direction:column;
            }

            .create-account-wrapper{
                min-width: 230px;
                display: none;
                flex-direction:column;
            }

            :host([showCreateAccount]) .create-account-wrapper{
                display: flex;
            }

            :host([showCreateAccount]) .signin-wrapper{
                display: none;
            }
            

            .signin-item{
                margin-top: 10px;
            }
        `;
    }

    @query('#email')
    public email?: HTMLInputElement;

    @query('#password')
    public password?: HTMLInputElement;

    @query('#cemail')
    public cemail?: HTMLInputElement;

    @query('#cpassword')
    public cpassword?: HTMLInputElement;

    @query('#firstname')
    public firstname?: HTMLInputElement;

    @query('#middlename')
    public middlename?: HTMLInputElement;

    @query('#familyname')
    public familyname?: HTMLInputElement;

    @property({ type: Boolean, reflect: true })
    public showCreateAccount?: boolean;

    public render = (): TemplateResult => html`
        <div class="vertical-wrapper">
            <div class="horizontal-wrapper">
                <div class="signin-wrapper">
                    <lit-input-field class="signin-item" id="email" placeholder="email address"></lit-input-field>
                    <lit-input-field class="signin-item" id="password" type="password" placeholder="password" @keyup="${this.signInIfEnter}"></lit-input-field>
                    <lit-button class="signin-item"  @click="${(): void => {
            this.signin()
        }}">Signin</lit-button>
                    <div class="signin-item" @click="${(): void => {
            this.showCreateAccount = true;
        }}">No account yet? Click here.</div>
                </div>
                <div class="create-account-wrapper">
                    <lit-input-field class="signin-item" id="firstname" placeholder="first name"></lit-input-field>
                    <lit-input-field class="signin-item" id="middlename" placeholder="middle name"></lit-input-field>
                    <lit-input-field class="signin-item" id="familyname" placeholder="family name"></lit-input-field>
                    <lit-input-field class="signin-item" id="cemail" placeholder="email address"></lit-input-field>
                    <lit-input-field class="signin-item" id="cpassword" type="password" placeholder="password" @keyup="${this.createIfEnter}"></lit-input-field>
                    <lit-button class="signin-item"  @click="${(): void => {
            this.createAccount()
        }}">Create account</lit-button>
                    <div class="signin-item" @click="${(): void => {
            this.showCreateAccount = false;
        }}">Already got an account? Click here.</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    private readonly getEmail = (): string => {
        return this.email ? this.email.value : '';
    }

    private readonly getPassword = (): string => {
        return this.password ? this.password.value : '';
    }

    private readonly getCEmail = (): string => {
        return this.cemail ? this.cemail.value : '';
    }

    private readonly getCPassword = (): string => {
        return this.cpassword ? this.cpassword.value : '';
    }

    private readonly getFirstName = (): string => {
        return this.firstname ? this.firstname.value : '';
    }

    private readonly getMiddleName = (): string => {
        return this.middlename ? this.middlename.value : '';
    }

    private readonly getFamilyName = (): string => {
        return this.familyname ? this.familyname.value : '';
    }

    private readonly signInIfEnter = (e: KeyboardEvent): void => {
        if (e.keyCode === 13) {
            this.signin();
        }
    }

    private readonly signin = (): void => {
        const email: string = this.getEmail();
        const password: string = this.getPassword();
        window.store.dispatch(requestSignin(email, password));
    }

    private readonly createIfEnter = (e: KeyboardEvent): void => {
        if (e.keyCode === 13) {
            this.createAccount();
        }
    }

    private readonly createAccount = (): void => {
        if (this.getFirstName() === '') {
            showNotification('First name cannot be empty')
            return;
        }

        if (this.getFamilyName() === '') {
            showNotification('Family name cannot be empty')
            return;
        }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(this.getCEmail()).toLowerCase())) {
            showNotification('Provided email is not valid')
            return;
        }
        if (this.getCPassword().length < 8) {
            showNotification('Password should atleast be 8 characters')
            return;
        }
        const createUserPayload = this.createUserPayload();
        fetch(window.API_LINK + "/user", {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: window.STDHeaders,
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(createUserPayload),
        }).then(async (resp) => {
            if (resp.status !== 200) {
                const response = await resp.json()
                if (response.detail) {
                    showNotification(response.detail)
                } else {
                    showNotification("Unable to create user")
                }
            } else {
                showNotification('Successfully created account for: ' + this.getCEmail())
                if (this.email) {
                    this.email.value = this.getCEmail()
                }
                this.showCreateAccount = false;
            }
        })
    }

    private createUserPayload = (): Object => {
        return {
            "password": this.getCPassword(),
            "email": this.getCEmail(),
            "first_name": this.getFirstName(),
            "middle_name": this.getMiddleName(),
            "family_name": this.getFamilyName(),
        }
    }

}

declare global {
    interface HTMLElementTagNameMap {
        'lit-signin': Signin;
    }
}
