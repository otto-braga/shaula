import ExpandableImage from '@/components/expandable-image';
import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { formatExhibitDateRange } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export interface ExhibitActivity {
    uuid: string;
    name: string;
}

export interface ExhibitPersonPivot {
    activity: ExhibitActivity | null;
    is_author: boolean;
}

export interface ExhibitPerson {
    uuid: string;
    slug: string;
    name: string;
    pivot?: ExhibitPersonPivot;
}

export interface ExhibitFile {
    uuid: string;
    name?: string;
    path: string;
    is_primary?: boolean | number;
    mime_type?: string;
    collection?: string;
}

export interface ExhibitPeriod {
    uuid: string;
    slug: string;
    name: string;
    start_date?: string;
    end_date?: string;
}

export interface ExhibitAward {
    uuid: string;
    name: string;
}

export interface ExhibitCategory {
    uuid: string;
    slug: string;
    name: string;
}

export interface ExhibitSource {
    uuid: string;
    slug: string;
    title: string;
    content: string;
    file?: ExhibitFile | null;
}

export interface ExhibitArtwork {
    uuid: string;
    slug: string;
    title: string;
    year?: number | string;
    date?: string;
    primary_image?: ExhibitFile | null;
    images?: ExhibitFile[];
}

export interface ExhibitDetail {
    uuid: string;
    slug: string;
    title: string;
    start_date?: string | null;
    end_date?: string | null;
    content: string | null;
    authors: ExhibitPerson[];
    people: ExhibitPerson[];
    periods: ExhibitPeriod[];
    awards: ExhibitAward[];
    categories: ExhibitCategory[];
    sources: ExhibitSource[];
    artworks: ExhibitArtwork[];
    images: ExhibitFile[];
    primary_image: ExhibitFile | null;
    content_images: ExhibitFile[];
    created_at?: string;
    updated_at?: string;
}

export interface ExhibitShowProps {
    exhibit:
        | {
              data: ExhibitDetail;
          }
        | ExhibitDetail;
}

export default function Show({ exhibit }: ExhibitShowProps) {
    const data: ExhibitDetail = 'data' in exhibit ? exhibit.data : exhibit;

    const mainImage = data.primary_image || (data.images && data.images.length > 0 ? data.images[0] : null);
    const galleryImages = (data.images || []).filter((img) => !mainImage || img.uuid !== mainImage.uuid);

    const hasAuthors = Boolean(data.authors && data.authors.length > 0);
    const hasPeople = Boolean(data.people && data.people.length > 0);
    const hasPeriods = Boolean(data.periods && data.periods.length > 0);
    const hasAwards = Boolean(data.awards && data.awards.length > 0);
    const hasCategories = Boolean(data.categories && data.categories.length > 0);
    const hasSources = Boolean(data.sources && data.sources.length > 0);

    const hasContent = Boolean(data.content && data.content.trim().length > 0 && data.content.trim() !== '<p></p>');
    const hasGallery = galleryImages.length > 0;
    const hasArtworks = Boolean(data.artworks && data.artworks.length > 0);

    const formattedDate = formatExhibitDateRange(data.start_date, data.end_date);

    const renderMetadataBlocks = (includeSources = false) => (
        <div className="space-y-4 divide-y *:pb-4">
            {hasAuthors && (
                <div>
                    <p className="font-semibold">Autoria</p>
                    <div className="mt-1 space-y-1">
                        {data.authors.map((author) => (
                            <Link href={route('public.people.show', author.slug)} key={author.uuid} className="block">
                                <p className="line-clamp-1 hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {hasPeople && (
                <div>
                    <p className="font-semibold">Equipe e Participantes</p>
                    <div className="mt-1 space-y-2">
                        {data.people.map((person) => (
                            <div key={person.uuid}>
                                <Link href={route('public.people.show', person.slug)}>
                                    <p className="line-clamp-1 hover:underline">{person.name}</p>
                                </Link>
                                {person.pivot?.activity?.name && (
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">{person.pivot.activity.name}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hasPeriods && (
                <div>
                    <p className="font-semibold">Períodos</p>
                    <div className="mt-1 space-y-1">
                        {data.periods.map((period) => (
                            <Link href={route('public.periods.show', period.slug)} key={period.uuid} className="block">
                                <p className="line-clamp-1 hover:underline">{period.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {hasCategories && (
                <div>
                    <p className="font-semibold">Categorias</p>
                    <div className="mt-1 space-y-1">
                        {data.categories.map((category) => (
                            <p key={category.uuid} className="line-clamp-1">
                                {category.name}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {hasAwards && (
                <div>
                    <p className="font-semibold">Premiações</p>
                    <div className="mt-1 space-y-1">
                        {data.awards.map((award) => (
                            <p key={award.uuid} className="line-clamp-1">
                                {award.name}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {includeSources && hasSources && (
                <div className="space-y-2">
                    <p className="font-semibold">Fontes</p>
                    {data.sources.map((source, index) => (
                        <div key={'source-mobile-' + index}>
                            <SourceCard source={source as any} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <PublicLayout head={data.title}>
            {/* Mobile bottom bar for exhibit technical sheet */}
            <MobileDetailBar title="Ficha Técnica">{renderMetadataBlocks(true)}</MobileDetailBar>

            {/* Top Split Exhibition Header (Cartaz / Cabeçalho da Exposição) */}
            <header className="grid grid-cols-1 divide-y border-b md:grid-cols-12 md:divide-x md:divide-y-0">
                <div className="flex flex-col justify-between p-4 sm:p-6 md:col-span-5 md:p-8 lg:p-12">
                    <div className="space-y-4">
                        <span className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                            Exposição
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">
                            {data.title}
                        </h1>
                        {formattedDate && (
                            <p className="text-lg font-medium text-zinc-600 md:text-xl dark:text-zinc-400">{formattedDate}</p>
                        )}
                    </div>

                    {(hasAuthors || hasPeriods) && (
                        <div className="mt-8 space-y-3 border-t pt-6">
                            {hasAuthors && (
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="font-semibold text-zinc-900 uppercase dark:text-zinc-100">Autoria: </span>
                                    {data.authors.map((author, index) => (
                                        <span key={author.uuid}>
                                            <Link
                                                href={route('public.people.show', author.slug)}
                                                className="text-zinc-900 hover:underline dark:text-zinc-100"
                                            >
                                                {author.name}
                                            </Link>
                                            {index < data.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {hasPeriods && (
                                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="font-semibold text-zinc-900 uppercase dark:text-zinc-100">Período: </span>
                                    {data.periods.map((period, index) => (
                                        <span key={period.uuid}>
                                            <Link
                                                href={route('public.periods.show', period.slug)}
                                                className="text-zinc-900 hover:underline dark:text-zinc-100"
                                            >
                                                {period.name}
                                            </Link>
                                            {index < data.periods.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-zinc-100 p-4 sm:p-6 md:col-span-7 md:p-4 dark:bg-zinc-900">
                    <div className="aspect-video max-h-[55vh] w-full overflow-hidden">
                        <ExpandableImage
                            src={'https://placehold.co/1280x900'}
                            alt={data.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </header>

            {/* Main Exhibition Body: Sticky Technical Sheet Sidebar + Horizontal Catalog Sections */}
            <div className="grid grid-cols-1 md:grid-cols-12 lg:divide-x">
                {/* Left Column: Ficha Técnica (Desktop) */}
                <aside className="hidden p-4 md:p-8 lg:col-span-3 lg:block">
                    <div className="sticky top-24 space-y-4">
                        <h2 className="border-b pb-3 text-sm font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                            Ficha Técnica
                        </h2>
                        {renderMetadataBlocks(false)}
                    </div>
                </aside>

                {/* Right Column: Curatorial Text, Artworks Catalog, Installation Views, Sources */}
                <div className="divide-y p-4 sm:p-6 md:col-span-12 md:p-8 lg:col-span-9">
                    {/* Curatorial Text */}
                    {hasContent && (
                        <section className="pb-10">
                            <h2 className="mb-6 text-xl font-medium uppercase">SOBRE A EXPOSIÇÃO</h2>
                            <div
                                dangerouslySetInnerHTML={{ __html: data.content as string }}
                                className="max-w-4xl text-lg leading-relaxed text-zinc-800 lg:text-xl dark:text-zinc-200"
                            />
                        </section>
                    )}

                    {/* Artworks in Exhibition (Showcase Grid) */}
                    {hasArtworks && (
                        <section className={`${hasContent ? 'pt-10' : ''} pb-10`}>
                            <div className="mb-6 flex items-baseline justify-between">
                                <h2 className="text-xl font-medium uppercase">OBRAS EM EXPOSIÇÃO</h2>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {data.artworks.length} {data.artworks.length === 1 ? 'obra' : 'obras'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                                {data.artworks.map((artwork) => {
                                    const artworkImg =
                                        artwork.primary_image?.path ||
                                        (artwork.images && artwork.images.length > 0
                                            ? artwork.images[0].path
                                            : 'https://placehold.co/800x800');

                                    return (
                                        <Link
                                            href={route('public.artworks.show', artwork.slug)}
                                            className="group flex flex-col"
                                            key={artwork.uuid}
                                        >
                                            <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                                <img
                                                    src={artworkImg}
                                                    alt={artwork.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <h3 className="line-clamp-2 text-base font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                                                    {artwork.title}
                                                </h3>
                                                {artwork.year && (
                                                    <p className="mt-0.5 text-sm text-slate-500 dark:text-zinc-400">{artwork.year}</p>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Exhibition Installation / Additional Views */}
                    {hasGallery && (
                        <section className={`${hasContent || hasArtworks ? 'pt-10' : ''} pb-10`}>
                            <h2 className="mb-6 text-xl font-medium uppercase">REGISTROS DA EXPOSIÇÃO</h2>
                            <div className="grid grid-cols-2 items-end gap-6 sm:grid-cols-3">
                                {galleryImages.map((image) => (
                                    <ExpandableImage
                                        key={image.uuid}
                                        src={image.path || 'https://placehold.co/900x1280'}
                                        alt={image.name || data.title}
                                        className="w-full object-cover"
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Bibliographic Sources */}
                    {hasSources && (
                        <section className={`${hasContent || hasArtworks || hasGallery ? 'pt-10' : ''}`}>
                            <h2 className="mb-4 text-xl font-medium uppercase">FONTES</h2>
                            <div className="space-y-3">
                                {data.sources.map((source, index) => (
                                    <div key={'source-' + index}>
                                        <SourceCard source={source as any} className="text-lg" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}


