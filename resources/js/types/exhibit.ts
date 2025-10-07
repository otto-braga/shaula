import { Activity } from "./activity";
import { Award } from "./award";
import { Category } from "./category";
import { FileProps } from "./file";
import { Language } from "./language";
import { Period } from "./period";
import { Person } from "./person";
import { Source } from "./source";

export enum ExhibitLabels {
    ROUTE = 'exhibits',
    TYPE = 'exhibit',
    TYPE_LABEL = 'Exposição',
    TYPE_PLURAL = 'Exposições'
}

export type Exhibit = {
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

    // Pessoas que não são autores, mas estão ligadas à obra por meio de uma atividade
    people: Person[];

    activities: Activity[];

    pivot: {
        activity: Activity | null;
        is_author: boolean;
    }

    categories: Category[];

    periods: Period[];
    awards: Award[];

    created_at: string;
    updated_at: string;
}
