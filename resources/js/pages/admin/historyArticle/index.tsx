import { PaginationProps } from '@/components/pagination/pagination';
import { HistoryArticle } from '@/types/historyArticle';
import { AdminIndex } from '@/components/ui/admin-index';

type Props = {
    data: HistoryArticle[];
    meta: PaginationProps;
};

export default function Index({ historyArticles }: { historyArticles: Props }) {
    return (
        <AdminIndex
            title="Artigos de História"
            route_base_name="history_articles"
            index={{ data: historyArticles.data, meta: historyArticles.meta }}
        />
    );
}
