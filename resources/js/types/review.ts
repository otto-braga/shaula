import { Category } from "./category";
import { FileProps } from "./file";
import { Mention } from "./mention";
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

    mentions: Mention[];
    sources: Source[];

    categories: Category[];

    created_at: string;
    updated_at: string;
}
