import { FileProps } from "./file";

export type Source = {
    id: number;
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
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    sources: Source[];
}
