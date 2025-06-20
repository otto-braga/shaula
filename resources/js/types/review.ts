import { Activity } from "./activity";
import { Category } from "./category";
import { FileProps } from "./file";
import { Person } from "./person";
import { Source } from "./source";

export type Review = {
    id: number;
    uuid: string;
    slug: string;
    title: string;
    date: string;
    authors: Person[];
    content: string;

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    people: Person[];

    categories: Category[];

    activity: Activity | null;

    mentions: string[];

    sources: Source[];

    created_at: string;
    updated_at: string;
}
