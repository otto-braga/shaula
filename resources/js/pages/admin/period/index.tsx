import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Period } from '@/types/period';

type Props = {
    data: Period[];
    meta: PaginationProps;
};

export default function Index({ periods }: { periods: Props }) {
    return (
        <AdminIndex
            title="Periodização"
            route_base_name="periods"
            index={{ data: periods.data, meta: periods.meta }}
        />
    );
}
