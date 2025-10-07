import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Exhibit } from '@/types/exhibit';

type Props = {
    data: Exhibit[];
    meta: PaginationProps;
};

export default function Index({ exhibits }: { exhibits: Props }) {
    return (
        <AdminIndex
            title="Exposições"
            route_base_name="exhibits"
            index={{ data: exhibits.data, meta: exhibits.meta }}
        />
    );
}
