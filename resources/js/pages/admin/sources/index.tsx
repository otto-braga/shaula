import { PaginationProps } from '@/components/pagination/pagination';
import { Source } from '@/types/source';
import { AdminIndex } from '@/components/ui/admin-index';

type Props = {
    data: Source[];
    meta: PaginationProps;
};

export default function Index({ sources }: { sources: Props }) {
    return (
        <AdminIndex
            title="Fontes"
            route_base_name="sources"
            index={{ data: sources.data, meta: sources.meta }}
            has_show={false}
        />
    );
}
