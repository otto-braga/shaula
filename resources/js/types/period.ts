import { FileProps } from "./file";
import { HistoryArticle } from "./historyArticle";
import { Mention } from "./mention";
import { Source } from "./source";

export enum PeriodLabels {
    ROUTE = 'periods',
    TYPE = 'period',
    TYPE_LABEL = 'Período',
    TYPE_PLURAL = 'Períodos'
}

export type Period = {
    uuid: string;
    slug: string;

    name: string;
    content: string;

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    mentions: Mention[];
    sources: Source[];

    history_articles: HistoryArticle[];

    start_date: string;
    end_date: string;

    created_at: string;
    updated_at: string;
}
