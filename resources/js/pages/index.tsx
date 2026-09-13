import ArtworkCard from '@/components/public/artwork-card';
import HistoryArticleCard from '@/components/public/history-article-card';
import ReviewCard from '@/components/public/review-card';
import PublicLayout from '@/layouts/public-layout';
import { Artwork } from '@/types/artwork';
import { HistoryArticle } from '@/types/historyArticle';
import { Review } from '@/types/review';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

interface IndexProps {
    reviews: { data: Review[] };
    historyArticles: { data: HistoryArticle[] };
    artworks: { data: Artwork[] };
}

export default function Index({ reviews, historyArticles, artworks }: IndexProps) {
    return (
        <PublicLayout head="SHAULA">
            {/* Seção Introdutória */}
            <section className="border-b px-4 py-12 md:px-8 md:py-16">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-50">
                        SHAULA
                    </h1>
                    <p className="mt-2 text-sm font-semibold tracking-widest text-gray-500 uppercase md:text-base dark:text-gray-400">
                        Memória e Acervo da Arte Potiguar
                    </p>
                    <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
                        O portal SHAULA é um espaço de memória e difusão dedicado às artes visuais e à história cultural potiguar. Desenvolvido no
                        âmbito do Curso de Artes Visuais e do grupo de pesquisa Matizes da UFRN, o projeto pesquisa, preserva e cataloga acervos de
                        obras, trajetórias de artistas, ensaios históricos e fortuna crítica, promovendo o acesso público e a valorização do patrimônio
                        artístico do Rio Grande do Norte.
                    </p>
                </div>
            </section>

            {/* Últimos Artigos de História */}
            {historyArticles?.data && historyArticles.data.length > 0 && (
                <section className="border-b px-4 py-8 md:p-8">
                    <Link href="/historia/artigos" className="inline-block">
                        <span className="flex items-center hover:underline">
                            <h2 className="text-red text-3xl">ÚLTIMOS ARTIGOS</h2>
                            <ArrowUpRight size={32} />
                        </span>
                    </Link>
                    <div className="mt-6 grid w-full gap-8 md:grid-cols-3">
                        {historyArticles.data.map((article) => (
                            <HistoryArticleCard key={article.uuid} article={article} />
                        ))}
                    </div>
                </section>
            )}

            {/* Obras em Destaque (6 obras aleatórias) */}
            {artworks?.data && artworks.data.length > 0 && (
                <section className="border-b px-4 py-8 md:p-8">
                    <div className="inline-block">
                        <span className="flex items-center">
                            <h2 className="text-red text-3xl">OBRAS EM DESTAQUE</h2>
                        </span>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                        {artworks.data.map((artwork) => (
                            <ArtworkCard key={artwork.uuid} artwork={artwork} />
                        ))}
                    </div>
                </section>
            )}

            {/* Últimas Críticas */}
            {reviews?.data && reviews.data.length > 0 && (
                <section className="px-4 py-8 md:p-8">
                    <Link href="/critica" className="inline-block">
                        <span className="flex items-center hover:underline">
                            <h2 className="text-red text-3xl">ÚLTIMAS CRÍTICAS</h2>
                            <ArrowUpRight size={32} />
                        </span>
                    </Link>
                    <div className="mt-6 grid w-full gap-8 md:grid-cols-3">
                        {reviews.data.map((review) => (
                            <ReviewCard key={review.uuid} review={review} />
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
