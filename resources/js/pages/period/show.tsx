import ExpandableImage from '@/components/expandable-image';
import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { FileProps } from '@/types/file';
import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export interface PeriodShowProps {
    period:
        | {
              data: Period;
          }
        | Period;
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

export default function Show({ period }: PeriodShowProps) {
    const data: Period = 'data' in period ? period.data : period;

    const images = Array.isArray(data.images) ? data.images.filter((img) => Boolean(img?.path)) : [];
    const mainImage =
        (data.primary_image && typeof data.primary_image.path === 'string' && data.primary_image.path.trim().length > 0
            ? data.primary_image
            : null) || (images.length > 0 ? images[0] : null);
    const galleryImages = images.filter((img) => !mainImage || img.uuid !== mainImage.uuid);

    const startDate = data.start_date?.toString().trim() || null;
    const endDate = data.end_date?.toString().trim() || null;
    const hasDates = Boolean(startDate || endDate);

    const hasContent = hasRichTextContent(data.content);
    const hasGallery = galleryImages.length > 0;
    const sources = Array.isArray(data.sources) ? data.sources.filter((s) => hasRichTextContent(s?.content) || s?.title) : [];
    const hasSources = sources.length > 0;

    const relatedArticles: HistoryArticle[] = Array.isArray(data.history_articles)
        ? data.history_articles.filter((article) => article?.slug && article?.title)
        : [];

    const richTextClasses =
        'text-lg leading-relaxed break-words text-zinc-800 sm:text-xl dark:text-zinc-200 [&_p]:mb-4 last:[&_p]:mb-0 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-zinc-950 dark:hover:[&_a]:text-zinc-50 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-700';

    return (
        <PublicLayout head={data.name || 'Período'}>
            <div className="bg-white dark:bg-zinc-950">
                {/* Banner Superior */}
                <div className="max-h-[40vh] w-full overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                    <img
                        src={mainImage ? mainImage.path : 'https://placehold.co/1280x900'}
                        alt={data.name}
                        className="h-full max-h-[40vh] w-full object-cover object-center"
                    />
                </div>

                {/* Layout Dividido em 2 Colunas */}
                <div className="grid grid-cols-1 divide-y divide-zinc-200 p-4 sm:p-6 md:grid-cols-2 md:gap-8 md:divide-x md:divide-y-0 md:p-8 dark:divide-zinc-800">
                    {/* Coluna Esquerda: Informações do Período */}
                    <section className="space-y-8 divide-y divide-zinc-200 pb-8 *:pt-8 first:*:pt-0 md:pr-8 md:pb-0 dark:divide-zinc-800">
                        <div>
                            <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                Periodização
                            </span>
                            <h1 className="mt-1 text-3xl font-bold tracking-tight break-words text-zinc-950 sm:text-4xl dark:text-zinc-50">
                                {data.name}
                            </h1>

                            {hasDates && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xl font-medium text-zinc-700 sm:text-2xl dark:text-zinc-300">
                                    {startDate && <span>{startDate}</span>}
                                    {startDate && endDate && <ArrowRight className="size-5 shrink-0 sm:size-6" />}
                                    {endDate && <span>{endDate}</span>}
                                </div>
                            )}

                            {hasContent ? (
                                <div dangerouslySetInnerHTML={{ __html: data.content }} className={`mt-6 sm:mt-8 ${richTextClasses}`} />
                            ) : (
                                <p className="mt-6 text-base text-zinc-500 italic dark:text-zinc-400">
                                    Sem descrição cadastrada para este período.
                                </p>
                            )}
                        </div>

                        {hasGallery && (
                            <div>
                                <h2 className="mb-4 text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">IMAGENS</h2>
                                <div className="grid grid-cols-2 items-end gap-4 sm:gap-6">
                                    {galleryImages.map((image) => (
                                        <div key={image.uuid} className="overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                            <ExpandableImage
                                                src={image.path}
                                                alt={image.name || data.name}
                                                className="w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasSources && (
                            <div>
                                <h2 className="mb-4 text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">FONTES</h2>
                                <div className="space-y-3 text-base text-zinc-800 dark:text-zinc-200">
                                    {sources.map((source, index) => (
                                        <div key={source.uuid || `source-${index}`}>
                                            <SourceCard source={source} className="text-base text-zinc-800 dark:text-zinc-200" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Coluna Direita: Artigos Relacionados */}
                    <section className="pt-8 md:pt-0 md:pl-2">
                        <div className="flex items-baseline justify-between gap-2">
                            <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">
                                Artigos relacionados
                            </h2>
                            {relatedArticles.length > 0 && (
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {relatedArticles.length} {relatedArticles.length === 1 ? 'artigo' : 'artigos'}
                                </span>
                            )}
                        </div>

                        <div className="mt-6">
                            {relatedArticles.length > 0 ? (
                                <div className="flex flex-col gap-6 divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {relatedArticles.map((article) => {
                                        const articleImage = resolveImagePath(
                                            article.primary_image,
                                            article.images,
                                            'https://placehold.co/800x800',
                                        );
                                        const articleAuthors = Array.isArray(article.authors)
                                            ? article.authors.filter((a) => a?.name)
                                            : [];
                                        const hasArticleExcerpt = hasRichTextContent(article.content);

                                        return (
                                            <Link
                                                key={article.uuid}
                                                href={route('public.history_articles.show', { historyArticle: article.slug })}
                                                className="group flex items-start gap-4 pb-6 last:pb-0 sm:gap-6"
                                            >
                                                <div className="aspect-square w-24 shrink-0 overflow-hidden bg-zinc-100 sm:w-36 md:w-32 lg:w-40 dark:bg-zinc-900">
                                                    <img
                                                        src={articleImage}
                                                        alt={article.title}
                                                        className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg font-medium break-words text-zinc-950 group-hover:underline sm:text-xl dark:text-zinc-50">
                                                        {article.title}
                                                    </h3>

                                                    {articleAuthors.length > 0 && (
                                                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                                                            {articleAuthors.map((author, index) => (
                                                                <span key={author.uuid} className="underline">
                                                                    {author.name}
                                                                    {index < articleAuthors.length - 1 ? ',' : ''}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {hasArticleExcerpt && (
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: article.content }}
                                                            className="mt-2 line-clamp-3 text-sm leading-relaxed break-words text-gray-600 sm:mt-3 sm:line-clamp-4 sm:text-base dark:text-zinc-300"
                                                        />
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-base text-zinc-500 italic dark:text-zinc-400">
                                    Nenhum artigo relacionado até o momento.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}

