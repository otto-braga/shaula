import { Category } from "./category";
import { FileProps } from "./file";
import { Person } from "./person";
import { Source } from "./source";

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

    mentions: string[];
    sources: Source[];

    categories: Category[];

    created_at: string;
    updated_at: string;
}
