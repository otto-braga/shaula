import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { FormEventHandler, useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { SearchResult } from '@/types/search-result';
import { typeLabelSearch } from '@/utils/type-label';
import { Edit } from 'lucide-react';

export type AdminDashboardSearchBarProps = {
    // route: string;
    q: string;
    className?: string;
}

function AdminDashboardSearchBar(props: AdminDashboardSearchBarProps) {
    // const { data, setData, get, errors, processing } = useForm({
    //     q: '',
    // });

    // const submit: FormEventHandler = (e) => {
    //     e.preventDefault();
    //     get(route(props.route), {
    //         preserveState: true,
    //         preserveScroll: true,
    //     });
    // }

    const [q, setQ] = useState(props.q || '');

    const [result, setResult] = useState<{ data: SearchResult[] }>({ data: [] });
    const [last_page, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchData = () => {
        // if (q.trim() === '') {
        //     setResult({ data: [] });
        //     setLastPage(1);
        //     return;
        // }

        const route_name = route('public.search.fetch.search') + `?q=${encodeURIComponent(q)}&page=${currentPage}`;

        fetch(route_name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Search results:', data);
                setResult({ data: data.results });
                setLastPage(data.last_page);
            })
            .catch((error) => console.error('Error fetching search results:', error));
    };

    // useEffect(() => {
    //     if (currentPage == 1) {
    //         fetchData();
    //     } else {
    //         setCurrentPage(1);
    //     }
    // }, [q]);

    useEffect(() => {
        if (currentPage < 1) {
            setCurrentPage(1);
            return;
        }
        if (currentPage > last_page) {
            setCurrentPage(last_page);
            return;
        }
        fetchData();
    }, [currentPage]);

    return (
        <div className={props.className ? ` ${props.className}` : ''}>
            <div className={'flex items-center justify-between gap-4 w-full'}>
                <Input
                    type="text"
                    placeholder="digite sua pesquisa"
                    className="w-full"
                    onChange={(e) => {
                        // setData('q', e.target.value);
                        setQ(e.target.value);
                    }}
                />
                <Button
                    // type='submit'
                    variant="secondary"
                    // className="ml-2"
                    // disabled={processing}
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                        fetchData();
                    }}
                >
                    Pesquisar
                </Button>
            </div>

            { result.data.length > 0 && (
                <section className="mt-4 space-y-8 md:col-span-4 md:pl-8">
                    <div className="space-y-4">
                        {result.data?.map((item: SearchResult, index: number) => (
                            <div key={index} className="flex flex-col items-start gap-4 border-b pb-4 md:flex-row">
                                {item.primary_image_path && (
                                    <img
                                        src={item.primary_image_url || '/default-image.png'}
                                        alt={item.title || item.name || 'Imagem'}
                                        className="aspect-square object-cover md:max-w-sm"
                                    />
                                )}
                                <div className="flex h-full flex-col space-y-3">
                                    <p className="text-gray-500">{item.type ? typeLabelSearch(item.type) : ''}</p>
                                    <div>
                                        <Link href={item.route || '#'} className="text-2xl font-semibold hover:underline">
                                            {item.title || item.name || '[Sem título]'}
                                        </Link>
                                        {item.authors && <p className="text-slate-600">{item.authors.join(', ')}</p>}
                                        {item.content && (
                                            <div dangerouslySetInnerHTML={{ __html: item.content }} className="mt-3 line-clamp-5 no-underline" />
                                        )}
                                    </div>
                                    {/* edit button */}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={route(item.route_base_name + '.edit', item.slug)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        <Edit />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`rounded border px-4 py-2 ${currentPage === 1
                                    ? 'cursor-not-allowed border-gray-300 text-gray-400'
                                    : 'border-blue-600 text-blue-600 hover:bg-blue-100'
                                    }`}
                            >
                                Anterior
                            </button>
                            <span className="text-sm text-gray-600">
                                Página {currentPage} de {last_page}
                            </span>
                            <button
                                onClick={(e) => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === last_page}
                                className={`rounded border px-4 py-2 ${currentPage === last_page
                                    ? 'cursor-not-allowed border-gray-300 text-gray-400'
                                    : 'border-blue-600 text-blue-600 hover:bg-blue-100'
                                    }`}
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export { AdminDashboardSearchBar }
