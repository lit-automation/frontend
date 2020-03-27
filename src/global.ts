declare interface Enums {
    apiUrl: string;
    passwordLength: number;
    projectStatus: any;
}

declare interface Window {
    cordova: any;
    webkitURL: URL;
    API_LINK: string;
    APP_DEV: boolean;
    APP_URL: string;
    STDHeaders: Headers;
    formatter: any;
    openTooltip?: any;
    REQUEST_FAILED: string;
    ENUMS: Enums;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<C>(a: C): C;
}

// Standard imports
declare module '*.pcss' {
    const content: string;
    export default content;
}

declare module '*.html' {
    const content: string;
    export default content;
}
