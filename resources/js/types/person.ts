import { Activity } from "./activity";
import { Artwork } from "./artwork";
import { City } from "./city";
import { FileProps } from "./file";
import { Gender } from "./gender";
import { Language } from "./language";
import { Mention } from "./mention";
import { Period } from "./period";
import { Review } from "./review";
import { Source } from "./source";

export type Person = {
    uuid: string;
    slug: string;

    name: string;
    date_of_birth: string | null;
    date_of_death: string | null;
    content: string;
    chronology: string;

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    mentions: Mention[];

    sources: Source[];

    artworks: Artwork[];
    activities: Activity[];

    // Atividades exercidas
    pivot: {
        activity: Activity | null;
        is_author: boolean;
    }

    periods: Period[];
    languages: Language[];
    reviews: Review[];
    genders: Gender[];
    cities: City[];

    links: string;

    created_at: string;
    updated_at: string;
}

export function personLabel(person: Person) {
    let label = '';

    if (person.date_of_birth || person.date_of_death) {
        label = ' (';

        if (person.date_of_birth) {
            label += new Date(person.date_of_birth).toLocaleDateString('pt-BR');
        }

        if (person.date_of_birth && person.date_of_death) {
            label += ' - ';
        }

        if (person.date_of_death) {
            label += new Date(person.date_of_death).toLocaleDateString('pt-BR');
        }

        label += ')';
    }

    return person.name + label;
}
