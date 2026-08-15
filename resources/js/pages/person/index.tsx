import PaginationWithAnchor from '@/components/PaginationWithAnchor';
import PublicLayout from '@/layouts/public-layout';
import { PaginatedData } from '@/types/paginated-data';
import { Person } from '@/types/person';
import { Link, router } from '@inertiajs/react';

export default function Index({ people, filters }: { people: PaginatedData<Person>, filters: any }) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const handleLetterFilter = (letter: string) => {
        const targetLetter = filters?.letter === letter ? null : letter;
        router.get(route('public.people.index'), { ...filters, letter: targetLetter }, { preserveState: true });
    };

    return (
        <PublicLayout head="Pessoas">
            <section className="px-4 py-4 md:px-8 md:py-8">
                <div className="mb-8 flex flex-wrap gap-2 justify-center">
                    {alphabet.map((letter) => (
                        <button
                            key={letter}
                            onClick={() => handleLetterFilter(letter)}
                            className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
                                filters?.letter === letter 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
                            }`}
                        >
                            {letter}
                        </button>
                    ))}
                    {filters?.letter && (
                        <button
                            onClick={() => handleLetterFilter(filters.letter)}
                            className="px-3 h-8 flex items-center justify-center rounded border bg-red-50 text-red-600 border-red-200 hover:bg-red-100 ml-2 text-sm"
                        >
                            Limpar
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                    <PaginationWithAnchor links={people.meta.links} />
                </div>
            </section>
        </PublicLayout>
    );
}
