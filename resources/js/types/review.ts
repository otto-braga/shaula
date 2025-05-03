import { Activity } from "./activity";
import { Artwork } from "./artwork";
import { Category } from "./category";
import { FileProps } from "./file";
import { Mention } from "./mention";
import { Person } from "./person";
import { Source } from "./source";
import { Tag } from "./tag";

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

    mentioned_people: Person[];
    mentioned_artworks: Artwork[];

    mentioned: Mention[];

    sources: Source[];

    categories: Category[];
    tags: Tag[];

    activity: Activity | null;

    created_at: string;
    updated_at: string;
}
