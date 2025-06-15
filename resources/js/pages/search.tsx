import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PublicLayout from '@/layouts/public-layout';
import { typeLabelSearch } from '@/utils/model-label';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type SearchResult = {
    type?: string | null;
    route?: string | null;
    name?: string | null;
    title?: string | null;
    authors?: string[] | null;
    content?: string | null;
    primary_image_path?: string | null;
    primary_image_url?: string | null;
};

type FilterOption = {
    name: string;
    value: Array<string>;
    label?: string;
};

export default function Index({ q }: { q: string }) {
    const [result, setResult] = useState<{ data: SearchResult[] }>({ data: [] });
    const [last_page, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);

    const [fetchedFilter, setFetchedFilter] = useState([] as FilterOption[]);
    const [filter, setFilter] = useState([] as FilterOption[]);

    const fetchFilter = () => {
        const route_name = route('public.search.filter.fetch.options');

        fetch(route_name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setFetchedFilter(data.data || []);

                setFilter(
                    data.data.map((option: FilterOption) => ({
                        name: option.name,
                        value: new Array<string>(),
                    })),
                );
            })
            .catch((error) => console.error('Error fetching filter data:', error));
    };

    useEffect(() => {
        fetchFilter();
    }, []);

    useEffect(() => {
        console.log('Fetched filter options:', fetchedFilter);
    }, [fetchedFilter]);

    useEffect(() => {
        console.log('Filter state updated:', filter);
    }, [filter]);

    const fetchData = () => {
        const route_name =
            route('public.search.fetch') + `?q=${encodeURIComponent(q)}&page=${currentPage}&filter=${encodeURIComponent(JSON.stringify(filter))}`;

        fetch(route_name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Search results:', data);
                setResult({ data: data.result });
                setLastPage(data.last_page);
            })
            .catch((error) => console.error('Error fetching search results:', error));
    };

    useEffect(() => {
        if (currentPage == 1) {
            fetchData();
        } else {
            setCurrentPage(1);
        }
    }, [q]);

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

    useEffect(() => {
        fetchData();
    }, [filter]);

    return (
        <PublicLayout head="SHAULA">
            <div className="grid grid-cols-5 divide-x px-4 md:px-8 md:pt-4">
                <section className="col-span-1 space-y-3">
                    <h1 className="">Filtros</h1>
                    <div className="space-y-2 divide-y pr-6">
                        {fetchedFilter &&
                            fetchedFilter.length > 0 &&
                            fetchedFilter.map((filterOption, index) => (
                                <Accordion type="single" collapsible>
                                    <AccordionItem value={filterOption.name}>
                                        <AccordionTrigger className="text-xl hover:cursor-pointer">{filterOption.label || ''}</AccordionTrigger>
                                        <AccordionContent>
                                            {filterOption.value.map((value, valueIndex) => (
                                                <label key={valueIndex} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        value={value}
                                                        checked={filter[index]?.value?.includes(value)}
                                                        onChange={(e) => {
                                                            const newFilter = [...filter];
                                                            if (e.target.checked) {
                                                                newFilter[index].value.push(e.target.value);
                                                            } else {
                                                                newFilter[index].value = newFilter[index].value.filter((v) => v !== e.target.value);
                                                            }
                                                            setFilter(newFilter);
                                                            setCurrentPage(1); // Reset to first page on filter change
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    {value}
                                                </label>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                    </div>
                </section>

                <section className="col-span-4 space-y-8 pl-8">
                    <h1 className="">Resultados da busca por "{q}"</h1>
                    <div className="space-y-4">
                        {result.data?.map((item: SearchResult, index: number) => (
                            <div key={index} className="flex items-start gap-4 border-b pb-4">
                                {item.primary_image_path && (
                                    <img
                                        src={item.primary_image_url || '/default-image.png'}
                                        alt={item.title || item.name || 'Imagem'}
                                        className="aspect-square max-w-sm object-cover"
                                    />
                                )}
                                <div className="space-y-3">
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
                                </div>
                            </div>
                        ))}
                    </div>
                    {last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`rounded border px-4 py-2 ${
                                    currentPage === 1
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
                                className={`rounded border px-4 py-2 ${
                                    currentPage === last_page
                                        ? 'cursor-not-allowed border-gray-300 text-gray-400'
                                        : 'border-blue-600 text-blue-600 hover:bg-blue-100'
                                }`}
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
