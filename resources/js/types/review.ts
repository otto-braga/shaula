import { Activity } from "./activity";
import { Category } from "./category";
import { FileProps } from "./file";
import { Person } from "./person";
import { Source } from "./source";

export enum ReviewLabels {
    ROUTE = 'reviews',
    TYPE = 'review',
    TYPE_LABEL = 'Crítica',
    TYPE_PLURAL = 'Críticas'
}

export type Review = {
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

    pivot?: {
        activity: Activity | null;
        is_author: boolean;
    };

    categories: Category[];

    created_at: string;
    updated_at: string;
}
