import PaginationWithAnchor from '@/components/PaginationWithAnchor';
import PublicLayout from '@/layouts/public-layout';
import { PaginatedData } from '@/types/paginated-data';
import { Exhibit } from '@/types/exhibit';
import { Link } from '@inertiajs/react';

export default function Index({ exhibits }: { exhibits: PaginatedData<Exhibit> }) {
    console.log(exhibits);

    return (
        <PublicLayout head="Exposições">
            <section className="px-4 py-4 md:px-8 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {exhibits.data.map((exhibit) => (
                        <Link key={exhibit.uuid} href={route('public.exhibits.show', exhibit)} className="relative group">
                            <div>
                                <div>
                                    <img
                                        src={`${exhibit.primary_image ? exhibit.primary_image.path : 'https://placehold.co/1280x900'}`}
                                        alt="Exhibit Image"
                                        className="aspect-square w-full object-cover group-hover:opacity-90 transition-opacity"
                                    />
                                </div>
                                <div className="mt-2">
                                    <h2 className="text-xl group-hover:underline">{exhibit.title}</h2>
                                    {exhibit.date && <p className="text-gray-600">{exhibit.date}</p>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <PaginationWithAnchor links={exhibits.meta.links} />
                </div>
            </section>
        </PublicLayout>
    );
}
