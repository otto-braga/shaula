import PaginationWithAnchor from '@/components/PaginationWithAnchor';
import PublicLayout from '@/layouts/public-layout';
import { PaginatedData } from '@/types/paginated-data';
import { Person } from '@/types/person';
import { Link, router } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

interface PersonIndexFilters {
    search?: string | null;
    letter?: string | null;
    orderBy?: string | null;
    direction?: string | null;
}

export default function Index({ people, filters }: { people: PaginatedData<Person>; filters?: PersonIndexFilters }) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const activeLetter = filters?.letter || null;

    const handleLetterFilter = (letter: string | null) => {
        const targetLetter = letter && activeLetter === letter ? undefined : (letter ?? undefined);
        const nextFilters = {
            ...(filters?.search ? { search: filters.search } : {}),
            ...(filters?.orderBy ? { orderBy: filters.orderBy } : {}),
            ...(filters?.direction ? { direction: filters.direction } : {}),
            ...(targetLetter ? { letter: targetLetter } : {}),
        };

        router.get(route('public.people.index'), nextFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout head="Pessoas">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
                {/* Header */}
                <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
                    <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">Acervo</span>
                    <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50">Pessoas</h1>
                        {people?.meta?.total !== undefined && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {people.meta.total} {people.meta.total === 1 ? 'registro' : 'registros'}
                                {activeLetter ? ` com a letra "${activeLetter}"` : ''}
                            </p>
                        )}
                    </div>

                    {/* Alphabet Filter */}
                    <div className="mt-8 flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleLetterFilter(null)}
                            className={`h-9 cursor-pointer border px-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                                !activeLetter
                                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
                            }`}
                        >
                            Todos
                        </button>
                        {alphabet.map((letter) => {
                            const isActive = activeLetter === letter;
                            return (
                                <button
                                    key={letter}
                                    type="button"
                                    onClick={() => handleLetterFilter(letter)}
                                    className={`flex h-9 w-9 cursor-pointer items-center justify-center border text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
                                    }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                        {activeLetter && (
                            <button
                                type="button"
                                onClick={() => handleLetterFilter(null)}
                                className="ml-2 cursor-pointer text-xs font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                Limpar filtro
                            </button>
                        )}
                    </div>
                </header>

                {/* People Listing */}
                <div id="pessoas" className="mt-8">
                    {people.data.length === 0 ? (
                        <div className="py-16 text-center text-zinc-500 dark:text-zinc-400">
                            <p className="text-lg">
                                {activeLetter
                                    ? `Nenhuma pessoa encontrada com a letra "${activeLetter}".`
                                    : 'Nenhuma pessoa encontrada.'}
                            </p>
                            {activeLetter && (
                                <button
                                    type="button"
                                    onClick={() => handleLetterFilter(null)}
                                    className="mt-3 inline-block cursor-pointer text-sm font-medium text-zinc-900 underline underline-offset-4 hover:opacity-80 dark:text-zinc-100"
                                >
                                    Limpar filtro
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {people.data.map((person) => (
                                <Link
                                    key={person.uuid}
                                    href={route('public.people.show', person)}
                                    className="group flex items-center justify-between border-b border-zinc-200 py-4 transition-colors hover:border-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-100"
                                >
                                    <h2 className="truncate pr-3 text-lg font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                                        {person.name}
                                    </h2>
                                    <ArrowUpRight className="size-4 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100" />
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <PaginationWithAnchor links={people.meta.links} anchor="#pessoas" />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

