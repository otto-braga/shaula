import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Gender } from '@/types/gender';

type Props = {
    data: Gender[];
    meta: PaginationProps;
};

export default function Index({ genders }: { genders: Props }) {
    return (
        <AdminIndex
            title="Gêneros"
            route_base_name="genders"
            index={{ data: genders.data, meta: genders.meta }}
            is_aux={true}
        />
    );
}
