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
};

export default function Index(
{
    q,
}: {
    q: string;
}) {
    const [result, setResult] = useState<{ data: SearchResult[] }>({ data: [] });
    const [total, setTotal] = useState(0);
    const [last_page, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const FetchData = () => {
        fetch(route('public.search.fetch') + `?q=${encodeURIComponent(q)}&page=${currentPage}`
        , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setResult({ data: data.result });
                setTotal(data.total);
                setLastPage(data.last_page);
            })
            .catch(error => console.error('Error fetching search results:', error));
    };

    useEffect(() => {
        if (currentPage == 1) {
            FetchData();
        }
        else {
            setCurrentPage(1);
        }
    }, [q]);

    const HandlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const HandleNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    useEffect(() => {
        FetchData();
    }, [currentPage]);

    return (
        <PublicLayout head="SHAULA">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Search Results for "{q}"</h1>
                {last_page > 1 && (
                    <div className="mt-6 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => HandlePreviousPage()}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded ${currentPage === 1
                                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                                }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {last_page}
                        </span>
                        <button
                            onClick={(e) => HandleNextPage()}
                            disabled={currentPage === last_page}
                            className={`px-4 py-2 border rounded ${currentPage === last_page
                                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
                <ul className="space-y-4">
                    {result.data?.map((item: SearchResult, index: number) => (
                        <li key={index} className="border-b pb-4">
                            <p className="text-gray-500">
                                {item.type ? typeLabelSearch(item.type) : ''}
                            </p>
                            <a
                                href={item.route || '#'}
                                className="text-lg font-semibold text-blue-600 hover:underline"
                            >
                                {item.title || item.name || 'Untitled'}
                            </a>
                            {item.authors && (
                                <p className="text-sm text-gray-600">
                                    By: {item.authors.join(', ')}
                                </p>
                            )}
                            {item.content && (
                                <p className="text-gray-800 mt-2">
                                    {item.content.substring(0, 150)}...
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </PublicLayout>
    );
}
