import { ReduxAsync } from '@weavedev/redux-async';

// tslint:disable-next-line:typedef
export const getArticles = new ReduxAsync(
    'Project: REQUEST_GET_ARTICLES',
    'Project: REQUEST_GET_ARTICLES_SUCCES',
    'Project: REQUEST_GET_ARTICLES_FAILURE',
    async (projectID: string, page: number, params: string): Promise<Object> => {
        return (await listArticlesForProject(projectID, page, params));
    },
);

window.storeReducers.articles = getArticles.reducer;
window.storeSagas.articles = getArticles.saga;

declare global {
    interface StoreReducersMap {
        getArticles: typeof getArticles.reducer;
    }

    interface StoreActionsMap {
        getArticles: typeof getArticles.actions;
    }
}

let listArticlesForProject = async function (projectID: string, page: number, params: string) {
    let data = {}

    let headers = window.STDHeaders
    let jwt = localStorage.getItem('jwt')
    if (!jwt) {
        console.warn("JWT NOT SET")
        return data
    }
    headers.set('Authorization', jwt)
    headers.set("X-List-Page", String(page))
    let response = await fetch(window.API_LINK + '/project/' + projectID + '/article/list?' + params, {
        method: 'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
    })
    try {
        let list = await response.json()
        data = {
            'list': list,
            'count': response.headers.get('X-List-Count'),
        }
    } catch (e) {
        console.warn("EXCPETION", e)
    }
    return data
};
