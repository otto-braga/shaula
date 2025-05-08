export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
        links: Array<{
            active: boolean;
            label: string;
            url: string | null;
        }>;
    };
};