import { Activity } from "./activity";
import { Award } from "./award";
import { Category } from "./category";
import { FileProps } from "./file";
import { Language } from "./language";
import { Person } from "./person";
import { Tag } from "./tag";

export type Review = {
    id: number;
    uuid: string;
    slug: string;
    title: string;
    date: string;
    authors: Person[];
    content: string;
    files: FileProps[];
    images: FileProps[];
    general_images: FileProps[];
    content_images: FileProps[];
    categories: Category[];
    tags: Tag[];

    activity: Activity | null;

    created_at: string;
    updated_at: string;
}