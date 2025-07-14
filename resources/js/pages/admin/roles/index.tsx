import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Role } from '@/types/role';

type Props = {
    data: Role[];
    meta: PaginationProps;
};

export default function Index({ roles }: { roles: Props }) {
    return (
        <AdminIndex
            title="Funções"
            route_base_name="roles"
            index={{ data: roles.data, meta: roles.meta }}
            has_show={false}
            has_create={false}
            has_edit={false}
            has_delete={false}
        />
    );
}
