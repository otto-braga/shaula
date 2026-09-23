import PaginationWithAnchor from '@/components/PaginationWithAnchor';
import PublicLayout from '@/layouts/public-layout';
import { formatExhibitDateRange } from '@/lib/utils';
import { Exhibit } from '@/types/exhibit';
import { PaginatedData } from '@/types/paginated-data';
import { Link } from '@inertiajs/react';

export default function Index({ exhibits }: { exhibits: PaginatedData<Exhibit> }) {
    console.log(exhibits);

    return (
        <PublicLayout head="Exposições">
            <section className="px-4 py-4 md:px-8 md:py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {exhibits.data.map((exhibit) => {
                        const formattedDate = formatExhibitDateRange(exhibit.start_date, exhibit.end_date);

                        return (
                            <Link key={exhibit.uuid} href={route('public.exhibits.show', exhibit)} className="group relative">
                                <div>
                                    <div>
                                        <img
                                            src={`${exhibit.primary_image ? exhibit.primary_image.path : 'https://placehold.co/1280x900'}`}
                                            alt="Exhibit Image"
                                            className="aspect-square w-full object-cover transition-opacity group-hover:opacity-90"
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <h2 className="text-xl group-hover:underline">{exhibit.title}</h2>
                                        {formattedDate && <p className="text-sm text-zinc-600 dark:text-zinc-400">{formattedDate}</p>}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className="mt-8 flex justify-center">
                    <PaginationWithAnchor links={exhibits.meta.links} />
                </div>
            </section>
        </PublicLayout>
    );
}
