import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { User } from '@/types/user';

type Props = {
    data: User[];
    meta: PaginationProps;
};

export default function Index({ users }: { users: Props }) {
    return (
        <AdminIndex
            title="Usuários"
            route_base_name="users"
            index={{ data: users.data, meta: users.meta }}
            has_show={false}
            has_create={false}
            has_delete={false}
        />
    );
}
