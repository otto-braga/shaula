import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Award } from '@/types/award';

type Props = {
    data: Award[];
    meta: PaginationProps;
};

export default function Index({ awards }: { awards: Props }) {
    return (
        <AdminIndex
            title="Prêmios"
            route_base_name="awards"
            index={{ data: awards.data, meta: awards.meta }}
            is_aux={true}
        />
    );
}
