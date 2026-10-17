import FeaturedCarousel from '@/components/public/featured-carousel';
import PublicLayout from '@/layouts/public-layout';
import { FileProps } from '@/types/file';
import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export interface HistoryArticleIndexProps {
    historyArticles: { data: HistoryArticle[] } | HistoryArticle[];
    periods: { data: Period[] } | Period[];
}

function hasRichTextContent(html?: string | null): boolean {
    if (!html) return false;
    const text = html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .trim();
    return text.length > 0;
}

function resolveImagePath(primaryImage?: FileProps | null, images?: FileProps[], fallback = 'https://placehold.co/1280x900'): string {
    if (primaryImage && typeof primaryImage.path === 'string' && primaryImage.path.trim().length > 0) {
        return primaryImage.path;
    }
    if (Array.isArray(images) && images.length > 0 && typeof images[0]?.path === 'string' && images[0].path.trim().length > 0) {
        return images[0].path;
    }
    return fallback;
}

export default function Index({ historyArticles, periods }: HistoryArticleIndexProps) {
    const articlesList: HistoryArticle[] = Array.isArray(historyArticles)
        ? historyArticles
        : Array.isArray(historyArticles?.data)
          ? historyArticles.data
          : [];

    const periodsList: Period[] = (Array.isArray(periods) ? periods : Array.isArray(periods?.data) ? periods.data : []).filter(
        (p) => p?.slug && p?.name,
    );

    return (
        <PublicLayout head="História">
            <FeaturedCarousel
                items={articlesList}
                getHref={(article) => route('public.history_articles.show', { historyArticle: article.slug })}
            />

            <section className="flex w-full items-center justify-center bg-white px-4 pt-8 pb-12 sm:px-6 md:px-8 dark:bg-zinc-950">
                <div className="w-full max-w-2xl">
                    {periodsList.length === 0 ? (
                        <div className="py-16 text-center text-zinc-500 dark:text-zinc-400">
                            <p className="text-lg">Nenhum período histórico cadastrado até o momento.</p>
                        </div>
                    ) : (
                        <div className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
                            {periodsList.map((period) => {
                                const imageSrc = resolveImagePath(period.primary_image, period.images, 'https://placehold.co/1280x900');
                                const startDate = period.start_date?.toString().trim() || null;
                                const endDate = period.end_date?.toString().trim() || null;
                                const hasDates = Boolean(startDate || endDate);
                                const hasExcerpt = hasRichTextContent(period.content);

                                return (
                                    <Link
                                        href={route('public.periods.show', { period: period.slug })}
                                        key={period.uuid}
                                        className="block"
                                    >
                                        <article className="group cursor-pointer space-y-3 border-l border-zinc-300 py-6 sm:py-8 dark:border-zinc-800">
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className="h-[1px] w-6 shrink-0 bg-zinc-300 transition-colors group-hover:bg-zinc-900 sm:w-8 dark:bg-zinc-700 dark:group-hover:bg-zinc-200" />
                                                <h2 className="text-2xl font-medium tracking-tight break-words text-zinc-950 group-hover:underline md:text-3xl dark:text-zinc-50">
                                                    {period.name}
                                                </h2>
                                            </div>

                                            <div className="space-y-3 pl-10 sm:pl-14">
                                                {hasDates && (
                                                    <div className="flex flex-wrap items-center gap-2 text-base text-zinc-600 sm:text-lg md:text-xl dark:text-zinc-400">
                                                        {startDate && <span>{startDate}</span>}
                                                        {startDate && endDate && <ArrowRight className="size-4 shrink-0 sm:size-5" />}
                                                        {endDate && <span>{endDate}</span>}
                                                    </div>
                                                )}

                                                <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                                    <img
                                                        src={imageSrc}
                                                        alt={period.name}
                                                        className="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                {hasExcerpt && (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: period.content }}
                                                        className="mt-3 line-clamp-5 text-base leading-relaxed break-words text-gray-600 sm:text-lg dark:text-zinc-300"
                                                    />
                                                )}
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

