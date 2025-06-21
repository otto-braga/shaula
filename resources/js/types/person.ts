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
    id: number;
    uuid: string | null;
    slug: string;
    name: string;
    date_of_birth: string | null;
    date_of_death: string | null;

    content: string;
    chronology: string;
    links: string;

    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    activities: Activity[];
    activity: Activity;

    genders: Gender[];
    cities: City[];

    periods: Period[];

    languages: Language[];

    artworks: Artwork[];
    reviews: Review[];

    mentions: Mention[];

    sources: Source[];

    created_at: string;
    updated_at: string;
}

export function personLabel(person: Person) {
    if (person.id < 0) return person.name + ' (NOVO)';

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
