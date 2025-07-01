import PublicLayout from '@/layouts/public-layout';
import { SearchFilterOption } from '@/types/search-filter-option';
import { SearchResult } from '@/types/search-result';
import { typeLabelSearch } from '@/utils/type-label';
import { useEffect, useState } from 'react';

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

    const fetchFilter = () => {
        let route_name = route('public.search.filter.fetch.options');

        fetch(route_name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setFetchedFilter(data.data || []);

                setFilter(data.data.map((option: SearchFilterOption) => ({
                    name: option.name,
                    value: new Array<string>(),
                    label: option.label,
                })));
            })
            .catch(error => console.error('Error fetching filter data:', error));
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
        // let route_name = route('public.search.fetch.search') + `?q=${encodeURIComponent(q)}&page=${currentPage}&filter=${encodeURIComponent(JSON.stringify(filter))}`;
        let route_name = route('public.search.fetch.search') + `?q=${encodeURIComponent(q)}&page=${currentPage}`;

        fetch(route_name
        , {
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
            .catch(error => console.error('Error fetching search results:', error));
    };

    useEffect(() => {
        if (currentPage == 1) {
            fetchData();
        }
        else {
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
            <div className="container mx-auto px-4">

                <div className='flex justify-center items-top mt-4 mb-6'>

                    {/* <div>
                        <h1 className="text-2xl font-bold mb-4">Filtros</h1>
                        <div className="space-y-2">

                            {fetchedFilter && fetchedFilter.length > 0 && (
                                fetchedFilter.map((filterOption, index) => (
                                    <div key={index} className="mb-4">
                                        <h2 className="text-lg font-semibold mb-2">{filterOption.label || ''}</h2>
                                        <div className="flex flex-col space-y-1">
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
                                                                newFilter[index].value = newFilter[index].value.filter(v => v !== e.target.value);
                                                            }
                                                            setFilter(newFilter);
                                                            setCurrentPage(1); // Reset to first page on filter change
                                                        }}
                                                        className="mr-2"
                                                    />
                                                    {value}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                    </div> */}

                    <div>
                        <h1 className="text-2xl font-bold mb-4">Resultados da busca por "{q}"</h1>
                        {last_page > 1 && (
                            <div className="mt-6 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded ${currentPage === 1
                                            ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                            : 'text-blue-600 border-blue-600 hover:bg-blue-100'
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
                                    className={`px-4 py-2 border rounded ${currentPage === last_page
                                            ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                            : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                                        }`}
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                        <ul className="space-y-4">
                            {result.data?.map((item: SearchResult, index: number) => (
                                <li key={index} className="border-b pb-4">
                                    <div className="flex flex-row items-center space-x-2 mb-2">
                                        {item.primary_image_path && (
                                            <img
                                                src={item.primary_image_url || '/default-image.png'}
                                                alt={item.title || item.name || 'Imagem'}
                                                className="w-32 h-32 object-cover aspect-square rounded"
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-gray-500">
                                                {item.type ? typeLabelSearch(item.type) : ''}
                                            </p>
                                            <a
                                                href={item.route || '#'}
                                                className="text-lg font-semibold text-blue-600 hover:underline"
                                            >
                                                {item.title || item.name || '[Sem título]'}
                                            </a>
                                            {item.authors && (
                                                <p className="text-sm text-gray-600">
                                                    {item.authors.join(', ')}
                                                </p>
                                            )}
                                            {item.content && (
                                                <p className="text-gray-800 mt-2">
                                                    {item.content.substring(0, 150)}...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
