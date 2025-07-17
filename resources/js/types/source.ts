import { FileProps } from "./file";

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
    file: FileProps | null;

    created_at: string;
    updated_at: string;
}

