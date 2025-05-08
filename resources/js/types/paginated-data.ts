export type InfiniteScrollData = {
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
};