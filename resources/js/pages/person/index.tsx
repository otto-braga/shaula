import PublicLayout from '@/layouts/public-layout';
import { InfiniteScrollData } from '@/types/paginated-data';
import { Person } from '@/types/person';
import { Link, router, WhenVisible } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ people, filters, pagination }: { people: Person[]; filters: { search: string }; pagination: InfiniteScrollData }) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        router.get('/pessoas', { search, page: '' }, { preserveState: false });
    }

    const [reachEnd, setReachEnd] = useState(pagination.current_page >= pagination.last_page);

    useEffect(() => {
        setReachEnd(pagination.current_page >= pagination.last_page);
    }, [pagination]);

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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
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
                                    <p>{person.cities?.map((city) => city.name)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {/* Carrega novas pessoas ao dar scroll
                    Quando o user chega a 100px(buffer = 100) do
                    compoenente whenvisible, é feito um request
                    para a próxima página da listagem. 'always' 
                    siginifica que sempre que o user chegar nesse
                    componente e enquanto a página atual for menor ou 
                    igual a ultima página da paginação, novas pessoas 
                    serão buscadas. Verificar PersonPublicController */}
                    <WhenVisible
                        buffer={100}
                        params={{
                            only: ['people', 'pagination'],
                            data: {
                                page: pagination.current_page + 1,
                            },
                        }}
                        fallback={'Carregando...'}
                        always={!reachEnd}
                    >
                        test
                    </WhenVisible>
                </div>

                {/* <div>
                    <Pagination>
                        <PaginationContent>
                            {people.meta.links.map((link, index) =>
                                link.url ? (
                                    <PaginationItem key={index}>
                                        <PaginationLink href={link.url} isActive={link.active}>
                                            {link.label === '&laquo; Previous' ? (
                                                <ChevronLeft />
                                            ) : link.label === 'Next &raquo;' ? (
                                                <ChevronRight />
                                            ) : (
                                                link.label
                                            )}
                                        </PaginationLink>
                                    </PaginationItem>
                                ) : (
                                    <></>
                                ),
                            )}
                        </PaginationContent>
                    </Pagination>
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
                </div> */}
            </section>
        </PublicLayout>
    );
}
