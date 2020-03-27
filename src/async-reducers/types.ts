
export type Project = {
  id: string,
  name: string,
  amount_of_articles: number;
  search_string: string;
  status: number;
  scrape_state: string;
}

export type ProjArticle = {
  abstract: string
  authors: string
  cited_amount: number
  comment: string
  doi: string
  got_pdf: boolean
  id: string
  journal: string
  language: string
  platform: number
  project_id: string
  publisher: string
  query: string
  query_platform: string
  search_result_number: number
  status: number
  title: string
  url: string
  year: number
}


