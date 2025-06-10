import PublicLayout from '@/layouts/public-layout';
import { typeLabelSearch } from '@/utils/model-label';
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

type Filter = {
    periods: string[];
    cities: string[];
};

export default function Index(
{
    q,
    // input_filter,
}: {
    q: string;
    // input_filter?: Filter;
}) {
    const [result, setResult] = useState<{ data: SearchResult[] }>({ data: [] });
    const [last_page, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);

    const [filter, setFilter] = useState({
        periods: new Array<string>(),
        cities: new Array<string>(),
    });

    const fetchData = () => {
        let route_name = route('public.search.fetch') + `?q=${encodeURIComponent(q)}&page=${currentPage}&filter=${encodeURIComponent(JSON.stringify(filter))}`;

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
                setResult({ data: data.result });
                setLastPage(data.last_page);
                setFilter(data.filter || filter);
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

                    <div>
                        <h1 className="text-2xl font-bold mb-4">Filtros</h1>
                        <div className="space-y-2">

                            <h2 className="text-lg font-semibold mb-2">Períodos</h2>
                            <div className="flex items-center">

                                <input
                                    type="checkbox"
                                    value="periodo tempora"
                                    checked={filter.periods.includes('periodo tempora')}
                                    onChange={(e) => {
                                        const newFilter = e.target.checked
                                            ? [...filter.periods, e.target.value]
                                            : filter.periods.filter(f => f !== e.target.value);
                                        setFilter({
                                            ...filter,
                                            periods: newFilter,
                                        });
                                        setCurrentPage(1); // Reset to first page on filter change
                                    }}
                                    className="mr-2"
                                />
                                <label>periodo tempora</label>

                                <input
                                    type="checkbox"
                                    value="periodo aut"
                                    checked={filter.periods.includes('periodo aut')}
                                    onChange={(e) => {
                                        const newFilter = e.target.checked
                                            ? [...filter.periods, e.target.value]
                                            : filter.periods.filter(f => f !== e.target.value);
                                        setFilter({
                                            ...filter,
                                            periods: newFilter,
                                        });
                                        setCurrentPage(1); // Reset to first page on filter change
                                    }}
                                    className="ml-4 mr-2"
                                />
                                <label>periodo aut</label>

                            </div>

                            <h2 className="text-lg font-semibold mb-2 mt-4">Cidades</h2>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filter.cities.includes('cidade Saulmouth')}
                                    onChange={(e) => {
                                        const newFilter = e.target.checked
                                            ? [...filter.cities, e.target.value]
                                            : filter.cities.filter(f => f !== e.target.value);
                                        setFilter({
                                            ...filter,
                                            cities: newFilter,
                                        });
                                        setCurrentPage(1); // Reset to first page on filter change
                                    }}
                                    className="mr-2"
                                    value="cidade Saulmouth"
                                />
                                <label>cidade Saulmouth</label>
                            </div>

                        </div>
                    </div>

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
