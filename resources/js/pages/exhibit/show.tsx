import ExpandableImage from '@/components/expandable-image';
import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { Badge } from '@/components/ui/badge';
import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Award as AwardIcon, Calendar } from 'lucide-react';

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
    date: string | null;
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

function safeFormatDate(dateStr?: string | null): string | null {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return formatDate(dateStr);
    } catch {
        return dateStr;
    }
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

    const hasCredits = hasAuthors || hasPeople;
    const hasMetadata = hasPeriods || hasAwards || hasCategories || hasSources;
    const hasSidebar = hasCredits || hasMetadata;

    const hasContent = Boolean(data.content && data.content.trim().length > 0 && data.content.trim() !== '<p></p>');
    const hasGallery = galleryImages.length > 0;
    const hasArtworks = Boolean(data.artworks && data.artworks.length > 0);

    const formattedDate = safeFormatDate(data.date);

    // Render metadata & credits section content (shared between desktop sidebar and mobile drawer)
    const renderSidebarContent = () => (
        <div className="space-y-6 divide-y divide-zinc-200 *:pt-6 first:*:pt-0 dark:divide-zinc-800">
            {/* Authors */}
            {hasAuthors && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Autoria</h3>
                    <ul className="mt-2 space-y-1.5">
                        {data.authors.map((author) => (
                            <li key={author.uuid}>
                                <Link
                                    href={route('public.people.show', author.slug)}
                                    className="text-base font-medium text-zinc-900 transition-colors hover:underline dark:text-zinc-100"
                                >
                                    {author.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Related People with Activities */}
            {hasPeople && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Equipe e Participantes</h3>
                    <ul className="mt-2 space-y-3">
                        {data.people.map((person) => (
                            <li key={person.uuid} className="flex flex-col">
                                <Link
                                    href={route('public.people.show', person.slug)}
                                    className="text-base font-medium text-zinc-900 transition-colors hover:underline dark:text-zinc-100"
                                >
                                    {person.name}
                                </Link>
                                {person.pivot?.activity?.name && (
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{person.pivot.activity.name}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Periods */}
            {hasPeriods && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Períodos</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {data.periods.map((period) => (
                            <Link key={period.uuid} href={route('public.periods.show', period.slug)}>
                                <Badge variant="outline" className="cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    {period.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards */}
            {hasAwards && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Premiações</h3>
                    <ul className="mt-2 space-y-2">
                        {data.awards.map((award) => (
                            <li key={award.uuid} className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                                <AwardIcon className="size-4 shrink-0 text-amber-500" />
                                <span>{award.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Categories */}
            {hasCategories && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Categorias</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {data.categories.map((category) => (
                            <Badge key={category.uuid} variant="secondary">
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Sources */}
            {hasSources && (
                <div>
                    <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">Fontes</h3>
                    <div className="mt-2 space-y-2">
                        {data.sources.map((source, index) => (
                            <div key={'source-' + index}>
                                <SourceCard source={source as any} className="text-sm text-zinc-700 dark:text-zinc-300" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <PublicLayout head={data.title}>
            {/* Mobile bottom drawer for credits and metadata */}
            {hasSidebar && <MobileDetailBar title="Detalhes da Exposição">{renderSidebarContent()}</MobileDetailBar>}

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
                {/* Header / Hero Section */}
                <header className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Exposição</span>
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">{data.title}</h1>
                    </div>

                    {/* Metadata Subtitle (Date and primary authors) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
                        {formattedDate && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-4 shrink-0 text-zinc-500" />
                                <span>{formattedDate}</span>
                            </div>
                        )}

                        {hasAuthors && (
                            <div className="flex items-center gap-1.5">
                                <span>Por</span>
                                {data.authors.map((author, index) => (
                                    <span key={author.uuid}>
                                        <Link
                                            href={route('public.people.show', author.slug)}
                                            className="font-medium text-zinc-800 underline-offset-2 hover:underline dark:text-zinc-200"
                                        >
                                            {author.name}
                                        </Link>
                                        {index < data.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main Image */}
                    {mainImage && (
                        <div className="relative mt-6 max-h-[65vh] w-full overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
                            <ExpandableImage src={mainImage.path} alt={data.title} className="max-h-[65vh] w-full object-cover" />
                        </div>
                    )}
                </header>

                {/* Main Body */}
                <div className={`mt-12 grid grid-cols-1 gap-12 ${hasSidebar ? 'lg:grid-cols-12' : ''}`}>
                    {/* Desktop Sidebar */}
                    {hasSidebar && (
                        <aside className="hidden lg:col-span-4 lg:block lg:pr-8">
                            <div className="sticky top-24">{renderSidebarContent()}</div>
                        </aside>
                    )}

                    {/* Main Content Area */}
                    <main className={`space-y-12 ${hasSidebar ? 'lg:col-span-8' : 'mx-auto max-w-4xl'}`}>
                        {/* Exhibit Content */}
                        {hasContent && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-medium tracking-wider text-zinc-900 uppercase dark:text-zinc-100">Sobre a Exposição</h2>
                                <div
                                    dangerouslySetInnerHTML={{ __html: data.content as string }}
                                    className="prose prose-lg dark:prose-invert max-w-none text-base leading-relaxed text-zinc-800 sm:text-lg dark:text-zinc-200"
                                />
                            </section>
                        )}

                        {/* Gallery */}
                        {hasGallery && (
                            <section className={`space-y-4 ${hasContent ? 'border-t border-zinc-200 pt-8 dark:border-zinc-800' : ''}`}>
                                <h2 className="text-xl font-medium tracking-wider text-zinc-900 uppercase dark:text-zinc-100">Galeria de Imagens</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {galleryImages.map((image) => (
                                        <div key={image.uuid} className="aspect-square overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
                                            <ExpandableImage src={image.path} alt={image.name || data.title} className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Artworks in Exhibition */}
                        {hasArtworks && (
                            <section className={`space-y-6 ${hasContent || hasGallery ? 'border-t border-zinc-200 pt-8 dark:border-zinc-800' : ''}`}>
                                <div className="flex items-baseline justify-between">
                                    <h2 className="text-xl font-medium tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
                                        Obras em Exposição
                                    </h2>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {data.artworks.length} {data.artworks.length === 1 ? 'obra' : 'obras'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {data.artworks.map((artwork) => {
                                        const artworkImg =
                                            artwork.primary_image?.path ||
                                            (artwork.images && artwork.images.length > 0 ? artwork.images[0].path : 'https://placehold.co/1280x900');

                                        return (
                                            <Link
                                                key={artwork.uuid}
                                                href={route('public.artworks.show', artwork.slug)}
                                                className="group block space-y-2.5"
                                            >
                                                <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
                                                    <img
                                                        src={artworkImg}
                                                        alt={artwork.title}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="line-clamp-2 text-base font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                                                        {artwork.title}
                                                    </h3>
                                                    {artwork.year && (
                                                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{artwork.year}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </PublicLayout>
    );
}
