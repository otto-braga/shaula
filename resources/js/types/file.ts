export type FileProps = {
    id: number;

    name: string;
    original_name: string;
    mime_type: string;
    path: string;

    collection: string;
    size: number;

    is_primary: boolean;
    is_temporary: boolean;

    blob?: Blob;

    created_at?: string;
    updated_at?: string;

    // lastModified: string;
    // lastModifiedDate: string;
    // type: string;
    // webkitRelativePath: string;
};
