import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PublicLayout from '@/layouts/public-layout';
import { SearchFilterOption } from '@/types/search-filter-option';
import { SearchResult } from '@/types/search-result';
import { typeLabelSearch } from '@/utils/type-label';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
    import { X } from 'lucide-react';

export default function Index(
{
    q,
}: {
    q: string;
}) {

    const [result, setResult] = useState<{ data: SearchResult[] }>({ data: [] });
    const [last_page, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);

    const [fetchedFilter, setFetchedFilter] = useState([] as SearchFilterOption[]);
    const [filter, setFilter] = useState([] as SearchFilterOption[]);

    const [appliedFilterNumber, setAppliedFilterNumber] = useState(0);

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

                setFilter(data.data.map((option: SearchFilterOption) => ({
                    name: option.name,
                    value: new Array<string>(),
                    label: option.label,
                })));
            })
            .catch((error) => console.error('Error fetching filter data:', error));
    };

    useEffect(() => {
        fetchFilter();
    }, []);

    useEffect(() => {
        // console.log('Fetched filter options:', fetchedFilter);
    }, [fetchedFilter]);

    useEffect(() => {
        console.log('Filter state updated:');
        // Calculate the number of applied filters
        let totalSelectedValues = 0;
        filter.forEach((f) => {
            if (f.value && f.value.length > 0) {
                totalSelectedValues += f.value.length;
            }
        });
        setAppliedFilterNumber(totalSelectedValues);
    }, [filter]);

    const fetchData = () => {

        // let route_name = route('public.search.fetch.search') + `?q=${encodeURIComponent(q)}&page=${currentPage}&filter=${encodeURIComponent(JSON.stringify(filter))}`;
        let route_name = route('public.search.fetch.search') + `?q=${encodeURIComponent(q)}&page=${currentPage}`;

        fetch(route_name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

            .then(response => response.json())
            .then(data => {
                console.log('Search results:', data);
                setResult({ data: data.results });
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

    useEffect(() => {
        console.log(filter);
    });

    const clearFilters = () => {
        // Redefine o estado 'filter' para o estado inicial (todos os valores vazios)
        // com base na estrutura de 'fetchedFilter'
        setFilter(
            fetchedFilter.map((option: FilterOption) => ({
                name: option.name,
                value: [],
                label: option.label,
            })),
        );
        setCurrentPage(1); // Volta para a primeira página após limpar os filtros
    };


    return (
        <PublicLayout head="SHAULA">
            <MobileDetailBar title={`Filtros`}>
                <div>
                    <div className="flex justify-end">
                        {appliedFilterNumber > 0 && (
                            <div className="flex items-center gap-2 bg-slate-200 px-3 py-2 text-sm text-black">
                                <p>{appliedFilterNumber} Filtros aplicados</p>
                                <button onClick={clearFilters}>
                                    <X size={24} />
                                </button>
                            </div>
                        )}{' '}
                    </div>
                    <div className="space-y-2 divide-y pr-6">
                        {fetchedFilter &&
                            fetchedFilter.length > 0 &&
                            fetchedFilter.map((filterOption, index) => (
                                <Accordion type="single" collapsible>
                                    <AccordionItem value={filterOption.name}>
                                        <AccordionTrigger className="text-xl hover:cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                {filterOption.label || ''}
                                                {(filter.find((f) => f.name === filterOption.name)?.value?.length ?? 0) > 0 && (
                                                    <span className="h-4 w-4 rounded-full bg-slate-500"></span>
                                                )}
                                            </div>
                                        </AccordionTrigger>
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
                </div>
            </MobileDetailBar>
            <div className="grid divide-x px-4 py-4 md:grid-cols-5 md:px-8">
                <section className="col-span-1 hidden space-y-3 lg:block">
                    <div className="flex justify-between py-2">
                        <h1 className="">Filtros</h1>
                        <div className="mr-3 flex justify-end">
                            {appliedFilterNumber > 0 && (
                                <div className="flex items-center gap-2 bg-slate-200 px-2 text-sm text-black">
                                    <p>{appliedFilterNumber} filtros aplicados</p>
                                    <button onClick={clearFilters} className="hover:cursor-pointer">
                                        <X size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
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

                <section className="space-y-8 md:col-span-4 md:pl-8">
                    <h1 className="">Resultados da busca por "{q}"</h1>
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
