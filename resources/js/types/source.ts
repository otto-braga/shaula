import { Category } from "./category";
import { FileProps } from "./file";
import { Mention } from "./mention";
import { Period } from "./period";
import { Person } from "./person";

export type Source = {
    id: number;
    uuid: string;
    slug: string;
    title: string;
    date: string;
    authors: Person[];
    content: string;

    files: FileProps[];
    primary_file: FileProps | null;
    images: FileProps[];
    primary_image: FileProps | null;
    content_images: FileProps[];

    categories: Category[];
    periods: Period[];

    mentioned: Mention[];
    mentioners: Mention[];

    created_at: string;
    updated_at: string;
}
