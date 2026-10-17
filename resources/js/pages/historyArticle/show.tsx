import ExpandableImage from '@/components/expandable-image';
import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { safeFormatDate } from '@/lib/utils';
import { FileProps } from '@/types/file';
import { HistoryArticle } from '@/types/historyArticle';
import { Link } from '@inertiajs/react';

export interface HistoryArticleShowProps {
    historyArticle:
        | {
              data: HistoryArticle;
          }
        | HistoryArticle;
}

function hasRichTextContent(html?: string | null): boolean {
    if (!html) return false;
    const text = html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .trim();
    return text.length > 0;
}

export default function Show({ historyArticle }: HistoryArticleShowProps) {
    const data: HistoryArticle = 'data' in historyArticle ? historyArticle.data : historyArticle;

    const images = Array.isArray(data.images) ? data.images.filter((img) => Boolean(img?.path)) : [];
    const mainImage =
        (data.primary_image && typeof data.primary_image.path === 'string' && data.primary_image.path.trim().length > 0
            ? data.primary_image
            : null) || (images.length > 0 ? images[0] : null);
    const galleryImages = images.filter((img) => !mainImage || img.uuid !== mainImage.uuid);

    const periods = Array.isArray(data.periods) ? data.periods.filter((p) => p?.name && p?.slug) : [];
    const authors = Array.isArray(data.authors) ? data.authors.filter((a) => a?.name && a?.slug) : [];
    const categories = Array.isArray(data.categories) ? data.categories.filter((c) => c?.name) : [];
    const sources = Array.isArray(data.sources) ? data.sources.filter((s) => hasRichTextContent(s?.content) || s?.title) : [];

    const hasPeriods = periods.length > 0;
    const hasAuthors = authors.length > 0;
    const hasCategories = categories.length > 0;
    const hasSources = sources.length > 0;
    const hasLinks = hasRichTextContent(data.links);
    const hasSidebarMetadata = Boolean(hasPeriods || hasAuthors || hasCategories || hasSources || hasLinks);

    const formattedDate = safeFormatDate(data.date);
    const hasContent = hasRichTextContent(data.content);
    const hasGallery = galleryImages.length > 0;

    const distributeIntoTwoColumns = <T,>(items: T[]): [T[], T[]] => {
        return items.reduce<[T[], T[]]>(
            (acc, item, index) => {
                acc[index % 2].push(item);
                return acc;
            },
            [[], []],
        );
    };

    const renderMetadataBlocks = () => (
        <div className="space-y-4 divide-y divide-zinc-200 *:pt-4 first:*:pt-0 dark:divide-zinc-800">
            {hasPeriods && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                        {periods.length === 1 ? 'Período' : 'Períodos'}
                    </h3>
                    <div className="mt-1.5 space-y-1">
                        {periods.map((period) => (
                            <Link
                                key={period.uuid}
                                href={route('public.periods.show', { period: period.slug })}
                                className="block text-lg font-medium text-zinc-950 hover:underline dark:text-zinc-50"
                            >
                                {period.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {hasAuthors && (
                <div>
                    <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Autoria</p>
                    <div className="mt-1.5 space-y-1">
                        {authors.map((author) => (
                            <Link
                                href={route('public.people.show', { person: author.slug })}
                                key={author.uuid}
                                className="block text-base text-zinc-800 hover:text-zinc-950 hover:underline dark:text-zinc-200 dark:hover:text-zinc-50"
                            >
                                {author.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {hasCategories && (
                <div>
                    <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Categorias</p>
                    <div className="mt-1.5 space-y-1 text-base text-zinc-800 dark:text-zinc-200">
                        {categories.map((category) => (
                            <p key={category.uuid}>{category.name}</p>
                        ))}
                    </div>
                </div>
            )}

            {hasLinks && (
                <div>
                    <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Links</p>
                    <div
                        className="mt-1.5 space-y-1 text-sm break-words text-zinc-700 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-zinc-950 dark:text-zinc-300 dark:hover:[&_a]:text-zinc-50"
                        dangerouslySetInnerHTML={{ __html: data.links }}
                    />
                </div>
            )}

            {hasSources && (
                <div>
                    <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Fontes</p>
                    <div className="mt-1.5 space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                        {sources.map((source, index) => (
                            <div key={source.uuid || `source-${index}`} className="break-words">
                                <SourceCard source={source} className="line-clamp-2 text-zinc-800 dark:text-zinc-200" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const richTextClasses =
        'text-lg leading-relaxed break-words text-zinc-800 md:text-xl lg:text-2xl dark:text-zinc-200 [&_p]:mb-5 last:[&_p]:mb-0 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-zinc-950 dark:hover:[&_a]:text-zinc-50 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-700';

    return (
        <PublicLayout head={data.title || 'História'}>
            {hasSidebarMetadata && <MobileDetailBar title="Detalhes">{renderMetadataBlocks()}</MobileDetailBar>}

            <div className="grid grid-cols-1 gap-8 bg-white p-4 pt-8 pb-20 sm:px-6 md:px-8 lg:grid-cols-6 lg:gap-12 lg:divide-x lg:divide-zinc-200 dark:bg-zinc-950 dark:lg:divide-zinc-800">
                {/* Coluna Esquerda: Metadados do Artigo (Desktop) */}
                {hasSidebarMetadata && (
                    <aside className="hidden lg:col-span-2 lg:block lg:pr-10">
                        <div className="">{renderMetadataBlocks()}</div>
                        {/* sticky top-24 para voltar com a barra sticky*/}
                    </aside>
                )}

                {/* Coluna Direita: Conteúdo do Artigo e Galeria */}
                <section
                    className={`space-y-8 divide-y divide-zinc-200 *:pt-8 first:*:pt-0 dark:divide-zinc-800 ${
                        hasSidebarMetadata ? 'lg:col-span-4 lg:pr-4' : 'mx-auto w-full max-w-4xl lg:col-span-6'
                    }`}
                >
                    <div>
                        <header className="mb-8 text-center">
                            <h1 className="text-2xl font-medium tracking-tight break-words text-zinc-950 sm:text-3xl md:text-4xl dark:text-zinc-50">
                                {data.title}
                            </h1>

                            {hasAuthors && (
                                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-base text-zinc-700 md:text-lg dark:text-zinc-300">
                                    {authors.map((author, index) => (
                                        <span key={author.uuid}>
                                            <Link
                                                href={route('public.people.show', { person: author.slug })}
                                                className="hover:text-zinc-950 hover:underline dark:hover:text-zinc-50"
                                            >
                                                {author.name}
                                            </Link>
                                            {index < authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </header>

                        {mainImage && (
                            <div className="mb-6 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                <ExpandableImage
                                    src={mainImage.path}
                                    alt={mainImage.name || data.title}
                                    className="h-64 w-full object-cover object-center sm:h-80 md:h-96"
                                />
                            </div>
                        )}

                        {formattedDate && (
                            <p className="mt-6 mb-4 text-sm text-zinc-500 dark:text-zinc-400">{formattedDate}</p>
                        )}

                        {hasContent ? (
                            <div dangerouslySetInnerHTML={{ __html: data.content }} className={richTextClasses} />
                        ) : (
                            <p className="text-base text-zinc-500 italic dark:text-zinc-400">
                                Este artigo ainda não possui conteúdo textual cadastrado.
                            </p>
                        )}
                    </div>

                    {hasGallery && (
                        <div>
                            <h2 className="mb-6 text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">IMAGENS</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                {distributeIntoTwoColumns<FileProps>(galleryImages).map((column, columnIndex) => (
                                    <div key={columnIndex} className="flex flex-col gap-4 sm:gap-6">
                                        {column.map((image) => (
                                            <div key={image.uuid} className="overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                                <ExpandableImage
                                                    src={image.path}
                                                    alt={image.name || data.title}
                                                    className="w-full cursor-pointer object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}

