export type SearchResult = {
    uuid: string;
    type?: string;
    slug?: string;
    route_base_name?: string;
    route?: string;

    label: string;
    name?: string;
    title?: string;

    content?: string;
    primary_image_path?: string;
    primary_image_url?: string;

    periods?: string[];
    categories?: string[];

    authors?: string[];
    cities?: string[];
    artworks?: string[];

    file_path?: string;
    source_categories?: string[];
};