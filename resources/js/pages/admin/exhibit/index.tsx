import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Exhibit } from '@/types/exhibit';

type Props = {
    data: Exhibit[];
    meta: PaginationProps;
};

export default function Index({ artworks }: { artworks: Props }) {
    return (
        <AdminIndex
            title="Obras"
            route_base_name="artworks"
            index={{ data: artworks.data, meta: artworks.meta }}
        />
    );
}
