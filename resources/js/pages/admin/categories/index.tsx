import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Category } from '@/types/category';

type Props = {
    data: Category[];
    meta: PaginationProps;
};

export default function Index({ categories }: { categories: Props }) {
    return (
        <AdminIndex
            title="Categorias"
            route_base_name="categories"
            index={{ data: categories.data, meta: categories.meta }}
            is_aux={true}
        />
    );
}
