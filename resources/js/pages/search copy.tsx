import PublicLayout from '@/layouts/public-layout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

type SearchResult = {
    route?: string | null;
    name?: string | null;
    title?: string | null;
    authors?: string[] | null;
    content?: string | null;
};

export default function Index(
    {
        q,
        result,
        total,
        last_page,
        currentPage,
    }: {
        q: string;
        result: { data: SearchResult[] };
        total: number;
        last_page: number;
        currentPage: number;
    }) {
    console.log(result, q, total, last_page);

    const { data, setData, get, errors, processing } = useForm({
        q: q || '',
        page: currentPage || 1,
        total: total || 0,
        last_page: last_page || 1,
    });

    const [page, setPage] = useState(currentPage);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (page < 1 || page > last_page) return;

        setData('page', page);

        get(route('public.search'));
    };

    return (
        <PublicLayout head="SHAULA">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Search Results for "{q}"</h1>
                <p className="mb-4">Total Results: {total}</p>
                <ul className="space-y-4">
                    {result.data?.map((item: SearchResult, index: number) => (
                        <li key={index} className="border-b pb-4">
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
                {last_page > 1 && (
                    <>
                        <div className="mt-6">
                            <p className="text-sm text-gray-600">
                                Showing page 1 of {last_page}. Pagination can be implemented here.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center items-center space-x-2">
                            <button
                                onClick={(e) => { setPage(currentPage - 1); submit(e)}}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 border rounded ${
                                    currentPage === 1
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
                                onClick={(e) => { setPage(currentPage + 1); submit(e) }}
                                disabled={currentPage === last_page}
                                className={`px-4 py-2 border rounded ${
                                    currentPage === last_page
                                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PublicLayout>
    );
}
