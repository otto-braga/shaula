import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { City } from '@/types/city';

type Props = {
    data: City[];
    meta: PaginationProps;
};

export default function Index({ cities }: { cities: Props }) {
    return (
        <AdminIndex
            title="Cidades"
            route_base_name="cities"
            index={{ data: cities.data, meta: cities.meta }}
            is_aux={true}
        />
    );
}
