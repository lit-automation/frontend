import * as enums from './enums';

const init: () => void = (): void => {
    if (window.location.href.indexOf('localhost') > -1 ||
        window.location.href.indexOf('0.0.0.0') > -1 ||
        window.location.href.indexOf('192.') > -1 ||
        window.location.href.indexOf('127.') > -1) {
        window.APP_URL = 'localhost';
        // tslint:disable-next-line:no-http-string
        window.API_LINK = 'http://localhost:9001/v1';
    } else if (window.location.href.indexOf('wimsp.nl') > -1) {
        window.APP_URL = 'lit.wimsp.nl';
        window.API_LINK = 'https://lit-api.wimsp.nl/v1';
    } else {
        // window.API_LINK = 'https://prodapi.ex/v1';
        // window.APP_URL = 'https://produrl.ex';
    }

    window.STDHeaders = new Headers();
    window.STDHeaders.append('Accept', 'application/json');
    window.STDHeaders.append('Content-type', 'application/json');

    const jwt: string | null = localStorage.getItem('jwt');

    if (jwt !== null) {
        window.STDHeaders.append('Authorization', `${jwt}`);
    }

    window.REQUEST_FAILED = 'REQUEST_FAILED';

    window.formatter = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
    });

    window.ENUMS = enums;
};

let initialized: boolean = false;

export const config: (() => void) = (): void => {
    if (!initialized) {
        initialized = true;
        init();
    }
};
