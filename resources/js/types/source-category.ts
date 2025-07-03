import { Source } from "./source";

export type SourceCategory = {
    uuid: string;
    name: string;
    sources: Source[];
    created_at: string;
    updated_at: string;
}