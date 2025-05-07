import PublicLayout from '@/layouts/public-layout';
import { Artwork } from '@/types/artwork';
import { HistoryArticle } from '@/types/historyArticle';
import { Review } from '@/types/review';

type Result = {
    reviews: Review[];
    artworks: Artwork[];
    historyArticles: HistoryArticle[];
};

export default function Index({ results, query }: { results: Result; query: string }) {
    console.log(results, query);
    return (
        <PublicLayout head="SHAULA">
            <h2>resultados da busca</h2>
        </PublicLayout>
    );
}
