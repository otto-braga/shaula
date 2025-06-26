export type FileProps = {
    // id: number;
    uuid: string;

    name: string;
    original_name: string;
    mime_type: string;
    path: string;

    collection: string;
    size: number;

    is_primary: boolean;

    blob?: Blob;

    created_at?: string;
    updated_at?: string;
};
