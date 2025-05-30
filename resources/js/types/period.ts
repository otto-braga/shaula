import { FileProps } from "./file";
import { HistoryArticle } from "./historyArticle";

export type Period = {
    id: number;
    uuid: string;
    slug: string;
    name: string;
    content: string;
    start_date: string;
    end_date: string;
    history_articles: HistoryArticle[];
    image: FileProps;
    primary_image: FileProps | null;
    created_at: string;
    updated_at: string;
}
