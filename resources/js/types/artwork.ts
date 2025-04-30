import { Activity } from "./activity";
import { Award } from "./award";
import { Category } from "./category";
import { FileProps } from "./file";
import { Language } from "./language";
import { Mention } from "./mention";
import { Period } from "./period";
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

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    categories: Category[];
    periods: Period[];

    people: Person[];
    activities: Activity[];

    activity: Activity | null;

    languages: Language[];
    awards: Award[];
    dimensions: string;
    materials: string;

    mentioned: Mention[];

    created_at: string;
    updated_at: string;
}
