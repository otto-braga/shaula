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
            <section className="w-full max-w-full overflow-hidden border-b px-4 py-12 md:px-8 md:py-16">
                <div className="mx-auto w-full max-w-3xl min-w-0 text-center break-words">
                    <h1 className="text-3xl font-bold tracking-tight break-words text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-50">
                        SHAULA
                    </h1>
                    <p className="mt-2 text-sm font-semibold tracking-widest break-words text-gray-500 uppercase md:text-base dark:text-gray-400">
                        Memória e Acervo da Arte Potiguar
                    </p>
                    <p className="mt-6 text-base leading-relaxed break-words text-gray-600 sm:text-lg dark:text-gray-300">
                        O portal SHAULA é um espaço de memória e difusão dedicado às artes visuais e à história cultural potiguar. Desenvolvido no
                        âmbito do Curso de Artes Visuais e do grupo de pesquisa Matizes da UFRN, o projeto pesquisa, preserva e cataloga acervos de
                        obras, trajetórias de artistas, ensaios históricos e fortuna crítica, promovendo o acesso público e a valorização do patrimônio
                        artístico do Rio Grande do Norte.
                    </p>
                </div>
            </section>

            {/* Últimos Artigos de História */}
            {historyArticles?.data && historyArticles.data.length > 0 && (
                <section className="w-full max-w-full overflow-hidden border-b px-4 py-8 md:p-8">
                    <Link href="/historia/artigos" className="inline-block max-w-full">
                        <span className="flex flex-wrap items-center gap-1 hover:underline">
                            <h2 className="text-red text-2xl break-words sm:text-3xl">ÚLTIMOS ARTIGOS</h2>
                            <ArrowUpRight size={32} className="shrink-0" />
                        </span>
                    </Link>
                    <div className="mt-6 grid w-full max-w-full grid-cols-1 gap-8 md:grid-cols-3">
                        {historyArticles.data.map((article) => (
                            <div key={article.uuid} className="w-full max-w-full min-w-0">
                                <HistoryArticleCard article={article} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Obras em Destaque (6 obras aleatórias) */}
            {artworks?.data && artworks.data.length > 0 && (
                <section className="w-full max-w-full overflow-hidden border-b px-4 py-8 md:p-8">
                    <div className="inline-block max-w-full">
                        <span className="flex flex-wrap items-center">
                            <h2 className="text-red text-2xl break-words sm:text-3xl">OBRAS EM DESTAQUE</h2>
                        </span>
                    </div>
                    <div className="mt-6 grid w-full max-w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                        {artworks.data.map((artwork) => (
                            <div key={artwork.uuid} className="w-full max-w-full min-w-0">
                                <ArtworkCard artwork={artwork} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Últimas Críticas */}
            {reviews?.data && reviews.data.length > 0 && (
                <section className="w-full max-w-full overflow-hidden px-4 py-8 md:p-8">
                    <Link href="/critica" className="inline-block max-w-full">
                        <span className="flex flex-wrap items-center gap-1 hover:underline">
                            <h2 className="text-red text-2xl break-words sm:text-3xl">ÚLTIMAS CRÍTICAS</h2>
                            <ArrowUpRight size={32} className="shrink-0" />
                        </span>
                    </Link>
                    <div className="mt-6 grid w-full max-w-full grid-cols-1 gap-8 md:grid-cols-3">
                        {reviews.data.map((review) => (
                            <div key={review.uuid} className="w-full max-w-full min-w-0">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
