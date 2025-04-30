import PublicLayout from '@/layouts/public-layout';
import { PaginatedData } from '@/types/paginated-data';
import { Person } from '@/types/person';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ people, filters }: { people: PaginatedData<Person>; filters: { search: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        router.get('/pessoas', { search }, { preserveState: true });
    }

    return (
        <PublicLayout head="Pessoas">
            <section className="px-4 py-4 md:px-8 md:py-8">
                <form onSubmit={handleSearch} className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar pessoas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md rounded border px-3 py-2"
                    />
                </form>
                <div className="grid grid-cols-4 gap-4">
                    {people.data.map((person) => (
                        <Link key={person.id} href={route('public.people.show', person)} className="relative">
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
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                    {people.meta.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`rounded border px-4 py-2 ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                            >
                                {link.label === '&laquo; Previous' ? 'Anterior' : link.label === 'Next &raquo;' ? 'Próxima' : link.label}
                            </Link>
                        ) : (
                            <span key={index} className="cursor-not-allowed rounded border px-4 py-2 text-gray-400">
                                {link.label}
                            </span>
                        ),
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
