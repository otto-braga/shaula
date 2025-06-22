export type SearchResult = {
    uuid?: string | null;
    type?: string | null;
    route?: string | null;

    label?: string | null;
    name?: string | null;
    title?: string | null;

    content?: string | null;
    primary_image_path?: string | null;
    primary_image_url?: string | null;

    periods?: string[] | null;
    categories?: string[] | null;

    authors?: string[] | null;
    cities?: string[] | null;
    artworks?: string[] | null;

    file_path?: string | null;
    source_categories?: string[] | null;
};