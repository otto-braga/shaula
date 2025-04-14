import { Activity } from "./activity";
import { Award } from "./award";
import { Category } from "./category";
import { FileProps } from "./file";
import { Language } from "./language";
import { Person } from "./person";
import { Tag } from "./tag";

export type Artwork = {
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

    people: Person[];
    activities: Activity[];
    activity: Activity | null;

    languages: Language[];
    awards: Award[];
    dimensions: string;
    materials: string;
}
