import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Artwork } from '@/types/artwork';

type Props = {
    data: Artwork[];
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
