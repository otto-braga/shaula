import { FileProps } from './file';

export interface About {
    id: number;
    uuid: string;
    title: string;
    content: string | null;
    cover_image: FileProps | null;
    created_at?: string;
    updated_at?: string;
}
