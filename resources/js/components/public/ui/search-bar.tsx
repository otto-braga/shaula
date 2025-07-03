import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
    const [q, setQ] = useState(typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setIsOpen(false);

        router.get(route('public.search'), { q }, { preserveState: true });
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="p-4 hover:cursor-pointer">
                <Search />
            </button>
            <div className={`${isOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full`}>
                <form onSubmit={handleSearch}>
                    <div className="flex h-20 w-full items-center gap-4 border-b bg-white/50 backdrop-blur-lg">
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="ml-4 w-full border-0 border-b-2 border-black px-3 text-4xl ring-0 focus:ring-0 focus:outline-0"
                        />
                        <span onClick={() => setIsOpen(false)} className="flex h-full items-center bg-black px-4 text-white hover:cursor-pointer">
                            <X size={32} />
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
