import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { SourceCategory } from '@/types/source-category';

type Props = {
    data: SourceCategory[];
    meta: PaginationProps;
};

export default function Index({ sourceCategories }: { sourceCategories: Props }) {
    return (
        <AdminIndex
            title="Categorias de Fontes"
            route_base_name="source_categories"
            index={{ data: sourceCategories.data, meta: sourceCategories.meta }}
            is_aux={true}
        />
    );
}
