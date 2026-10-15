import PaginationWithAnchor from '@/components/PaginationWithAnchor';
import PublicLayout from '@/layouts/public-layout';
import { formatExhibitDateRange } from '@/lib/utils';
import { Exhibit } from '@/types/exhibit';
import { PaginatedData } from '@/types/paginated-data';
import { Link } from '@inertiajs/react';

export default function Index({ exhibits }: { exhibits: PaginatedData<Exhibit> }) {
    return (
        <PublicLayout head="Exposições">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
                {/* Header */}
                <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
                    <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Acervo</span>
                    <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">
                            Exposições
                        </h1>
                        {exhibits?.meta?.total !== undefined && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {exhibits.meta.total} {exhibits.meta.total === 1 ? 'exposição' : 'exposições'}
                            </p>
                        )}
                    </div>
                </header>

                {/* Exhibits Grid */}
                <div id="exposicoes" className="mt-8">
                    {exhibits.data.length === 0 ? (
                        <div className="py-16 text-center text-zinc-500 dark:text-zinc-400">
                            <p className="text-lg">Nenhuma exposição encontrada.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {exhibits.data.map((exhibit) => {
                                const formattedDate = formatExhibitDateRange(exhibit.start_date, exhibit.end_date);
                                const imageSrc =
                                    exhibit.primary_image?.path ||
                                    (exhibit.images && exhibit.images.length > 0 ? exhibit.images[0].path : 'https://placehold.co/1280x900');

                                return (
                                    <Link
                                        key={exhibit.uuid}
                                        href={route('public.exhibits.show', exhibit)}
                                        className="group flex flex-col"
                                    >
                                        <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                            <img
                                                src={imageSrc}
                                                alt={exhibit.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="mt-3 flex flex-1 flex-col">
                                            <h2 className="text-xl font-medium text-zinc-950 group-hover:underline dark:text-zinc-50">
                                                {exhibit.title}
                                            </h2>
                                            {formattedDate && (
                                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{formattedDate}</p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <PaginationWithAnchor links={exhibits.meta.links} anchor="#exposicoes" />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

