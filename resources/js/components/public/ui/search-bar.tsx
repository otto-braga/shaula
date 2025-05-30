import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
    const [q, setQ] = useState(
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : ''
    );

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        router.get(route('public.search'), { q }, { preserveState: true });
    }

    return (
        <form onSubmit={handleSearch}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full border-0 border-b-2 border-black px-3 py-2 text-lg ring-0 focus:ring-0 focus:outline-0"
                />
                <button type="submit" className="absolute right-0 bottom-1 bg-white p-2 hover:cursor-pointer">
                    <Search />
                </button>
            </div>
        </form>
    );
}
