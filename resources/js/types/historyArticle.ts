import { Category } from "./category";
import { FileProps } from "./file";
import { Period } from "./period";
import { Person } from "./person";
import { Source } from "./source";

export enum HistoryArticleLabels {
    ROUTE = 'history_articles',
    TYPE = 'history_article',
    TYPE_LABEL = 'Artigo de História',
    TYPE_PLURAL = 'Artigos de História'
}

export type HistoryArticle = {
    uuid: string;
    slug: string;

    title: string;
    date: string;
    authors: Person[];
    content: string;

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    sources: Source[];

    categories: Category[];
    periods: Period[];

    links: string;

    created_at: string;
    updated_at: string;
}
