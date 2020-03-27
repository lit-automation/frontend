import { ReduxAsync } from '@weavedev/redux-async';

// tslint:disable-next-line:typedef
export const listProjects = new ReduxAsync(
    'Project: REQUEST_LIST_PROJECT',
    'Project: REQUEST_LIST_PROJECT_SUCCES',
    'Project: REQUEST_LIST_PROJECT_FAILURE',
    async (): Promise<Object> => {
        return (await retrieveProjects());
    },
);

window.storeReducers.projects = listProjects.reducer;
window.storeSagas.projects = listProjects.saga;

declare global {
    interface StoreReducersMap {
        listProjects: typeof listProjects.reducer;
    }

    interface StoreActionsMap {
        listProjects: typeof listProjects.actions;
    }
}

let retrieveProjects = async function () {
    let headers = window.STDHeaders
    let jwt = localStorage.getItem('jwt')
    if (!jwt){
        console.warn("JWT NOT SET")
        return 
    }
    headers.set('Authorization', jwt)
    let response = await fetch(window.API_LINK + '/project/list', {
        method: 'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
    })
    try {
        let resp = await response.json()
        if (resp.status){
            throw new Error("unable to list projects")
        }else{
            return resp
        }
    } catch (e) {
        console.warn("EXCPETION", e)
    }
};
