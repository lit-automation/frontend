// tslint:disable-next-line:no-http-string
export const apiUrl: Enums['apiUrl'] = 'https://api.todo.dev:443';

export const passwordLength: Enums['passwordLength'] = 8;

export const projectStatus = {
    Status: ['Init Phase','Conducting Search','Articles Gathered','Screening Phase','Data Extraction Phase','Done'],
    InitPhase: 1,
    ConductingSearch: 2,
    ArticlesGathered: 3,
    ScreeningPhase: 4,
    DataExtractionPhase: 5,
    Done: 6,
};

export const platform = {
    Status: ['Google Scholar','ACM','Springer','IEEE','Web Of Science','Science Direct'],
    GoogleScholar: 1,
    ACM: 2,
    Springer: 3,
    IEEE: 4,
    WebOfScience: 5,
    ScienceDirect: 6,
};