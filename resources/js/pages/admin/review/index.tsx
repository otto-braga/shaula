import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Review } from '@/types/review';

type Props = {
    data: Review[];
    meta: PaginationProps;
};

export default function Index({ reviews }: { reviews: Props }) {
    return (
        <AdminIndex
            title="Críticas"
            route_base_name="reviews"
            index={{ data: reviews.data, meta: reviews.meta }}
        />
    );
}
