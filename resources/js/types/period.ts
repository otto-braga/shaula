import { FileProps } from "./file";

export type Period = {
    id: number;
    uuid: string;
    slug: string;
    name: string;
    content: string;
    start_date: string;
    end_date: string;
    image: FileProps;
    primary_image: FileProps | null;
    created_at: string;
    updated_at: string;
}
