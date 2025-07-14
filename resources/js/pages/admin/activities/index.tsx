import { PaginationProps } from '@/components/pagination/pagination';
import { AdminIndex } from '@/components/ui/admin-index';
import { Activity } from '@/types/activity';

type Props = {
    data: Activity[];
    meta: PaginationProps;
};

export default function Index({ activities }: { activities: Props }) {
    return (
        <AdminIndex
            title="Atividades"
            route_base_name="activities"
            index={{ data: activities.data, meta: activities.meta }}
            is_aux={true}
        />
    );
}
