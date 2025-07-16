import { FileProps } from "./file";
import { SourceCategory } from "./source-category";

export enum SourceLabels {
    ROUTE = 'sources',
    TYPE = 'source',
    TYPE_LABEL = 'Fonte',
    TYPE_PLURAL = 'Fontes'
}

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

