import ExpandableImage from '@/components/expandable-image';
import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { formatExhibitDateRange, safeFormatDate } from '@/lib/utils';
import { Artwork } from '@/types/artwork';
import { Exhibit } from '@/types/exhibit';
import { FileProps } from '@/types/file';
import { Person } from '@/types/person';
import { Review } from '@/types/review';
import { Link } from '@inertiajs/react';

export interface PersonShowProps {
    person:
        | {
              data: Person;
          }
        | Person;
}

function hasRichTextContent(html?: string | null): boolean {
    if (!html) return false;
    const text = html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .trim();
    return text.length > 0;
}

function resolveImagePath(primaryImage?: FileProps | null, images?: FileProps[], fallback = 'https://placehold.co/800x800'): string {
    if (primaryImage && typeof primaryImage.path === 'string' && primaryImage.path.trim().length > 0) {
        return primaryImage.path;
    }
    if (Array.isArray(images) && images.length > 0 && typeof images[0]?.path === 'string' && images[0].path.trim().length > 0) {
        return images[0].path;
    }
    return fallback;
}

export default function Show({ person }: PersonShowProps) {
    const data: Person = 'data' in person ? person.data : person;

    const images = Array.isArray(data.images) ? data.images : [];
    const mainImage =
        (data.primary_image && typeof data.primary_image.path === 'string' && data.primary_image.path.trim().length > 0
            ? data.primary_image
            : null) || (images.length > 0 && images[0]?.path ? images[0] : null);
    const galleryImages = images.filter((img) => img?.path && (!mainImage || img.uuid !== mainImage.uuid));

    const cities = Array.isArray(data.cities) ? data.cities.filter((c) => c?.name) : [];
    const periods = Array.isArray(data.periods) ? data.periods.filter((p) => p?.name && p?.slug) : [];
    const awards = Array.isArray(data.awards) ? data.awards.filter((a) => a?.name) : [];
    const sources = Array.isArray(data.sources) ? data.sources.filter((s) => hasRichTextContent(s?.content) || s?.title) : [];
    const reviews = Array.isArray(data.reviews) ? data.reviews.filter((r) => r?.slug && r?.title) : [];
    const artworks = Array.isArray(data.artworks) ? data.artworks.filter((a) => a?.slug && a?.title) : [];
    const exhibits = Array.isArray(data.exhibits) ? data.exhibits.filter((e) => e?.slug && e?.title) : [];

    const birthDate = safeFormatDate(data.date_of_birth);
    const deathDate = safeFormatDate(data.date_of_death);
    const hasLinks = hasRichTextContent(data.links);
    const hasBio = hasRichTextContent(data.content);
    const hasChronology = hasRichTextContent(data.chronology);
    const hasGallery = galleryImages.length > 0;
    const hasSources = sources.length > 0;

    const hasReviews = reviews.length > 0;
    const hasArtworks = artworks.length > 0;
    const hasExhibits = exhibits.length > 0;

    const hasMetadata = Boolean(cities.length > 0 || birthDate || deathDate || periods.length > 0 || awards.length > 0 || hasLinks);
    const hasMiddleColumn = Boolean(hasBio || hasChronology || hasGallery || hasSources);
    const hasRightColumn = Boolean(hasReviews || hasArtworks || hasExhibits);

    const distributeIntoTwoColumns = <T,>(items: T[]): [T[], T[]] => {
        return items.reduce<[T[], T[]]>(
            (acc, item, index) => {
                acc[index % 2].push(item);
                return acc;
            },
            [[], []],
        );
    };

    const richTextClasses =
        'text-lg leading-relaxed break-words text-zinc-800 dark:text-zinc-200 [&_p]:mb-4 last:[&_p]:mb-0 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-zinc-950 dark:hover:[&_a]:text-zinc-50 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-700';

    return (
        <PublicLayout head={data.name}>
            <div className="grid grid-cols-1 bg-white p-4 sm:p-6 md:grid-cols-3 md:gap-6 md:p-8 lg:grid-cols-5 lg:gap-8 lg:divide-x lg:divide-zinc-200 dark:bg-zinc-950 dark:lg:divide-zinc-800">
                {/* Coluna 1: Retrato e Ficha Biográfica */}
                <section className="pb-6 md:col-span-1 md:pb-0 lg:pr-8">
                    <div className="lg:sticky lg:top-24">
                        <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <ExpandableImage
                                src={mainImage ? mainImage.path : 'https://placehold.co/800x800'}
                                alt={data.name}
                                className="aspect-square h-full w-full object-cover"
                            />
                        </div>

                        <div className="mt-4 md:mt-6">
                            <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Pessoa</span>
                            <h1 className="mt-1 text-2xl font-medium tracking-tight break-words text-zinc-950 lg:text-3xl dark:text-zinc-50">
                                {data.name}
                            </h1>
                        </div>

                        {hasMetadata && (
                            <div className="mt-4 divide-y divide-zinc-200 border-t border-zinc-200 pt-4 text-sm *:py-3 first:*:pt-0 last:*:pb-0 dark:divide-zinc-800 dark:border-zinc-800">
                                {cities.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                                            {cities.length === 1 ? 'Cidade' : 'Cidades'}
                                        </p>
                                        <div className="mt-1 space-y-0.5 text-zinc-700 dark:text-zinc-300">
                                            {cities.map((city) => (
                                                <p key={city.uuid}>{city.name}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {birthDate && (
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">Nascimento</p>
                                        <p className="mt-1 text-zinc-700 dark:text-zinc-300">{birthDate}</p>
                                    </div>
                                )}

                                {deathDate && (
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">Falecimento</p>
                                        <p className="mt-1 text-zinc-700 dark:text-zinc-300">{deathDate}</p>
                                    </div>
                                )}

                                {periods.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                                            {periods.length === 1 ? 'Período' : 'Períodos'}
                                        </p>
                                        <div className="mt-1 space-y-1">
                                            {periods.map((period) => (
                                                <Link
                                                    key={period.uuid}
                                                    href={route('public.periods.show', period.slug)}
                                                    className="block text-zinc-700 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                                                >
                                                    {period.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {awards.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                                            {awards.length === 1 ? 'Premiação' : 'Premiações'}
                                        </p>
                                        <div className="mt-1 space-y-1 text-zinc-700 dark:text-zinc-300">
                                            {awards.map((award) => (
                                                <p key={award.uuid}>{award.name}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {hasLinks && (
                                    <div>
                                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">Links</p>
                                        <div
                                            className="mt-1 space-y-1 break-words text-zinc-700 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-zinc-950 dark:text-zinc-300 dark:hover:[&_a]:text-zinc-50"
                                            dangerouslySetInnerHTML={{ __html: data.links }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Coluna 2: Biografia, Cronologia, Registros e Fontes */}
                {hasMiddleColumn && (
                    <section
                        className={`border-t border-zinc-200 py-6 md:col-span-2 md:border-t-0 md:border-l md:py-0 md:pl-6 lg:border-l-0 lg:pl-0 dark:border-zinc-800 ${
                            hasRightColumn ? 'lg:col-span-2 lg:pr-8' : 'lg:col-span-4'
                        }`}
                    >
                        <div className="space-y-8 divide-y divide-zinc-200 *:pt-8 first:*:pt-0 dark:divide-zinc-800">
                            {hasBio && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">BIOGRAFIA</h2>
                                    <div dangerouslySetInnerHTML={{ __html: data.content }} className={richTextClasses} />
                                </div>
                            )}

                            {hasChronology && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">CRONOLOGIA</h2>
                                    <div dangerouslySetInnerHTML={{ __html: data.chronology }} className={richTextClasses} />
                                </div>
                            )}

                            {hasGallery && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">IMAGENS</h2>
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
                                <div className="space-y-4">
                                    <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">FONTES</h2>
                                    <div className="space-y-3 text-base text-zinc-800 dark:text-zinc-200">
                                        {sources.map((source, index) => (
                                            <div key={source.uuid || `source-${index}`}>
                                                <SourceCard source={source} className="text-base text-zinc-800 dark:text-zinc-200" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Coluna 3: Produção Relacionada (Críticas, Obras e Exposições) */}
                {hasRightColumn && (
                    <section
                        className={`border-t border-zinc-200 pt-6 pb-3 dark:border-zinc-800 ${
                            hasMiddleColumn
                                ? 'md:col-span-3 md:mt-2 md:pt-8 lg:col-span-2 lg:mt-0 lg:border-t-0 lg:pt-0'
                                : 'md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6 lg:col-span-4 lg:border-l-0 lg:pl-0'
                        }`}
                    >
                        <div className="space-y-8 divide-y divide-zinc-200 *:pt-8 first:*:pt-0 dark:divide-zinc-800">
                            {hasReviews && (
                                <div>
                                    <div className="mb-6 flex items-baseline justify-between gap-2">
                                        <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">CRÍTICAS</h2>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {reviews.length} {reviews.length === 1 ? 'crítica' : 'críticas'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {reviews.map((review: Review) => {
                                            const reviewImage = resolveImagePath(review.primary_image, review.images, 'https://placehold.co/600x600');
                                            const reviewExcerpt = hasRichTextContent(review.content) ? review.content : null;

                                            return (
                                                <Link
                                                    href={route('public.reviews.show', review.slug)}
                                                    key={review.uuid}
                                                    className="group flex items-start gap-4"
                                                >
                                                    <div className="size-24 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                                        <img
                                                            src={reviewImage}
                                                            alt={review.title}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-lg font-medium break-words text-zinc-950 group-hover:underline sm:text-xl dark:text-zinc-50">
                                                            {review.title}
                                                        </h3>
                                                        {reviewExcerpt && (
                                                            <div
                                                                dangerouslySetInnerHTML={{ __html: reviewExcerpt }}
                                                                className="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-zinc-400"
                                                            />
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {hasArtworks && (
                                <div>
                                    <div className="mb-6 flex items-baseline justify-between gap-2">
                                        <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">OBRAS</h2>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {artworks.length} {artworks.length === 1 ? 'obra' : 'obras'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                        {distributeIntoTwoColumns(artworks).map((column, columnIndex) => (
                                            <div key={columnIndex} className="flex flex-col gap-6 sm:gap-8">
                                                {column.map((artwork: Artwork) => {
                                                    const artworkImg = resolveImagePath(
                                                        artwork.primary_image,
                                                        artwork.images,
                                                        'https://placehold.co/800x800',
                                                    );
                                                    const roleLabel = artwork.pivot?.is_author
                                                        ? 'Autoria'
                                                        : artwork.pivot?.activity?.name || null;

                                                    return (
                                                        <Link
                                                            href={route('public.artworks.show', artwork.slug)}
                                                            className="group flex flex-col"
                                                            key={artwork.uuid}
                                                        >
                                                            <div className="overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                                                <img
                                                                    src={artworkImg}
                                                                    alt={artwork.title}
                                                                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <div className="mt-3">
                                                                <h3 className="text-base font-medium break-words text-zinc-950 group-hover:underline sm:text-lg dark:text-zinc-50">
                                                                    {artwork.title}
                                                                </h3>
                                                                {roleLabel && (
                                                                    <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{roleLabel}</p>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hasExhibits && (
                                <div>
                                    <div className="mb-6 flex items-baseline justify-between gap-2">
                                        <h2 className="text-xl font-medium tracking-wide text-zinc-950 uppercase dark:text-zinc-50">EXPOSIÇÕES</h2>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {exhibits.length} {exhibits.length === 1 ? 'exposição' : 'exposições'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                        {distributeIntoTwoColumns(exhibits).map((column, columnIndex) => (
                                            <div key={columnIndex} className="flex flex-col gap-6 sm:gap-8">
                                                {column.map((exhibit: Exhibit) => {
                                                    const exhibitImg = resolveImagePath(
                                                        exhibit.primary_image,
                                                        exhibit.images,
                                                        'https://placehold.co/800x800',
                                                    );
                                                    const formattedExhibitDate = formatExhibitDateRange(exhibit.start_date, exhibit.end_date);
                                                    const roleLabel = exhibit.pivot?.is_author
                                                        ? 'Autoria'
                                                        : exhibit.pivot?.activity?.name || null;

                                                    return (
                                                        <Link
                                                            href={route('public.exhibits.show', exhibit.slug)}
                                                            className="group flex flex-col"
                                                            key={exhibit.uuid}
                                                        >
                                                            <div className="overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                                                <img
                                                                    src={exhibitImg}
                                                                    alt={exhibit.title}
                                                                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <div className="mt-3">
                                                                <h3 className="text-base font-medium break-words text-zinc-950 group-hover:underline sm:text-lg dark:text-zinc-50">
                                                                    {exhibit.title}
                                                                </h3>
                                                                {roleLabel && (
                                                                    <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{roleLabel}</p>
                                                                )}
                                                                {formattedExhibitDate && (
                                                                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                                                                        {formattedExhibitDate}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Fallback caso o registro ainda não possua biografia nem produção associada */}
                {!hasMiddleColumn && !hasRightColumn && (
                    <section className="border-t border-zinc-200 py-8 md:col-span-2 md:border-t-0 md:border-l md:py-0 md:pl-6 lg:col-span-4 lg:border-l-0 lg:pl-0 dark:border-zinc-800">
                        <p className="text-base text-zinc-500 dark:text-zinc-400">
                            Não há informações biográficas ou produções associadas a este registro.
                        </p>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}

