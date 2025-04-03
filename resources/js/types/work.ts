import { Activity } from "./activity";
import { Award } from "./award";
import { Category } from "./category";
import { City } from "./city";
import { FileProps } from "./file";
import { Language } from "./language";
import { Person } from "./person";
import { Tag } from "./tag";

export type Work = {
    id: number;
    uuid: string;
    slug: string;

    title: string;
    date: string;
    date_end: string;
    description: string;
    content: string;

    work_type: string;
    workable: Artwork | Review;

    authors: Person[];
    people: Person[];
    activities: Activity[];
    cities: City[];
    languages: Language[];
    awards: Award[];
    categories: Category[];
    tags: Tag[];

    // mentioners: Mention[];
    // mentions: Mention[];

    files: FileProps[];
    images: FileProps[];
    general_images: FileProps[];
    content_images: FileProps[];

    activity: Activity | null;
}

export type Review = {
    id: number;
}

export type Artwork = {
    id: number;
    dimensions: string;
    materials: string;
    is_museumized: boolean;
}