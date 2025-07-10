import { AdminSearchBar } from '../admin-search-bar/admin-search-bar';
import { PaginationControls, PaginationProps } from '../pagination/pagination';

export type AdminIndexBarProps = {
    index_route: string;
    pagination_meta: PaginationProps;
}

function AdminIndexBar(props : AdminIndexBarProps) {
    return (
        <div className="flex flex-row justify-between items-center mt-4">
            <AdminSearchBar route={props.index_route} />
            <PaginationControls pagination={props.pagination_meta} />
        </div>
    );
}

export { AdminIndexBar }
