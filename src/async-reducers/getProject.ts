import { ReduxAsync } from '@weavedev/redux-async';

// tslint:disable-next-line:typedef
export const getProject = new ReduxAsync(
    'Project: REQUEST_GET_PROJECT',
    'Project: REQUEST_GET_PROJECT_SUCCES',
    'Project: REQUEST_GET_PROJECT_FAILURE',
    async (id: string): Promise<Object> => {
        return (await latestProject(id));
    },
);

window.storeReducers.selectedProject = getProject.reducer;
window.storeSagas.selectedProject = getProject.saga;

declare global {
    interface StoreReducersMap {
        getProject: typeof getProject.reducer;
    }

    interface StoreActionsMap {
        getProject: typeof getProject.actions;
    }
}

let latestProject = async function (id: string) {
    let data = {}
    let url = '/project/latest'
    if(id != ''){
        url = '/project/'+id
    }
    let headers = window.STDHeaders
    let jwt = localStorage.getItem('jwt')
    if (!jwt){
        console.warn("JWT NOT SET")
        return data
    }
    headers.set('Authorization', jwt)

    let response = await fetch(window.API_LINK + url, {
        method: 'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
    })
    try {
        data = await response.json()
    } catch (e) {
        console.warn("EXCPETION", e)
    }
    return data
};
