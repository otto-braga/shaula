import { Activity } from "./activity";
import { Award } from "./award";
import { City } from "./city";
import { FileProps } from "./file";
import { Gender } from "./gender";
import { Language } from "./language";
import { Link } from "./link";
import { Work } from "./work";

export type Person = {
    id: number;
    uuid: string | null;
    slug: string | null;
    name: string;
    genders: Gender[];
    cities: City[];
    works: Work[];
    worksAsAuthor: Work[];
    links: Link[];
    image: FileProps;
    activity: Activity;
    activities: Activity[];
    activitiesThroughWorks: Activity[];
    languages: Language[];
    languagesThroughWorks: Language[];
    awards: Award[];
    bio: string;
    chrono: string;
    date_of_birth: string | null;
    date_of_death: string | null;
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
