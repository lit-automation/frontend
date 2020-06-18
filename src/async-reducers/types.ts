import { SelectOption } from '../elements/Select';

export type Project = {
    id: string;
    name: string;
    amount_of_articles: number;
    search_string: string;
    status: number;
    scrape_state: string;
};

export type ProjArticle = {
    abstract: string;
    full_text: string;
    authors: string;
    cited_amount: number;
    comment: string;
    doi: string;
    got_pdf: boolean;
    id: string;
    journal: string;
    language: string;
    platform: number;
    project_id: string;
    publisher: string;
    query: string;
    query_platform: string;
    search_result_number: number;
    status: number;
    title: string;
    url: string;
    type: string;
    year: number;
};

export const ArticleTypeOptions: SelectOption[] = [
    {
        value: 'none',
        text: 'None',
    },
    {
        value: 'book-chapter',
        text: 'Book',
    },
    {
        value: 'journal-article',
        text: 'Journal Article',
    },
    {
        value: 'proceedings-article',
        text: 'Conference Article',
    },
];

export const ArticleStatusOptions: SelectOption[] = [
    {
        value: '1',
        text: 'Unprocessed',
    },
    {
        value: '2',
        text: 'Excluded',
    },
    {
        value: '3',
        text: 'Included',
    },
    {
        value: '4',
        text: 'Unknown',
    },
    {
        value: '5',
        text: 'Duplicate',
    },
];
