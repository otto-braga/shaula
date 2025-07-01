import { FileProps } from "./file";

export type Source = {
    uuid: string;
    slug: string;

    title: string;
    content: string;
    source_categories: SourceCategory[];
    file: FileProps | null;

    created_at: string;
    updated_at: string;
}

export type SourceCategory = {
    uuid: string;
    name: string;
    sources: Source[];
    created_at: string;
    updated_at: string;
}
