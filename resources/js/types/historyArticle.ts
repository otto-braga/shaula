import { Activity } from "./activity";
import { Category } from "./category";
import { FileProps } from "./file";
import { Mention } from "./mention";
import { Period } from "./period";
import { Person } from "./person";
import { Source } from "./source";

export type HistoryArticle = {
    id: number;
    uuid: string;
    slug: string;

    title: string;
    date: string;
    authors: Person[];
    content: string;

    links: string;

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    categories: Category[];
    periods: Period[];

    activity: Activity | null;

    mentions: Mention[];

    sources: Source[];

    created_at: string;
    updated_at: string;
}
