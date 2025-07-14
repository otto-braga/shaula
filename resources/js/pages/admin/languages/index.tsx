import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Language } from '@/types/language';

type Props = {
    data: Language[];
    meta: PaginationProps;
};

export default function Index({ languages }: { languages: Props }) {
    return (
        <AdminIndex
            title="Linguagens"
            route_base_name="languages"
            index={{ data: languages.data, meta: languages.meta }}
            is_aux={true}
        />
    );
}
