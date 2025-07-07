import Pagination from '@/components/Pagination';
import PublicLayout from '@/layouts/public-layout';
import { PaginatedData } from '@/types/paginated-data';
import { Person } from '@/types/person';
import { Link } from '@inertiajs/react';

export default function Index({ people }: { people: PaginatedData<Person> }) {
    console.log(people);

    return (
        <PublicLayout head="Pessoas">
            <section className="px-4 py-4 md:px-8 md:py-8">
                <div className="grid grid-cols-4 gap-8">
                    {people.data.map((person) => (
                        <Link key={person.uuid} href={route('public.people.show', person)} className="relative">
                            <div>
                                <div>
                                    <img
                                        src={`${person.primary_image ? person.primary_image.path : 'https://placehold.co/1280x900'}`}
                                        alt="person Image"
                                        className="aspect-square w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl">{person.name}</h2>
                                    {person.activities?.map((activity) => <p>{activity.name}</p>)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center">
                    <Pagination links={people.meta.links} />
                </div>
            </section>
        </PublicLayout>
    );
}
