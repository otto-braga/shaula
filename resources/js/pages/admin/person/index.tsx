import { PaginationProps } from '@/components/pagination/pagination';
import { Person } from '@/types/person';
import { AdminIndex } from '@/components/ui/admin-index';

type Props = {
    data: Person[];
    meta: PaginationProps;
};

export default function Index({ people }: { people: Props }) {
    return (
        <AdminIndex
            title="Pessoas"
            route_base_name="people"
            index={{ data: people.data, meta: people.meta }}
        />
    );
}
