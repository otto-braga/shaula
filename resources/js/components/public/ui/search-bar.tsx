import { router } from '@inertiajs/react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar() {
    const [q, setQ] = useState(
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '',
    );
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (typeof window !== 'undefined') {
                const urlQ = new URLSearchParams(window.location.search).get('q');
                if (urlQ !== null) {
                    setQ(urlQ);
                }
            }
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setIsOpen(false);

        router.get(route('public.search'), { q: q.trim() });
    }

    return (
        <div ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Fechar busca' : 'Abrir busca'}
                aria-expanded={isOpen}
                className={`flex h-10 w-10 items-center justify-center transition-colors hover:cursor-pointer ${
                    isOpen
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
            >
                <Search className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute top-16 left-0 z-50 w-full border-b border-zinc-200 bg-white/95 shadow-lg backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
                    <form
                        onSubmit={handleSearch}
                        className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 md:px-8"
                    >
                        <Search className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-500" />

                        <div className="relative flex flex-1 items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar obras, pessoas, exposições, artigos, críticas..."
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full border-0 border-b border-zinc-300 bg-transparent py-2 pr-8 text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-black focus:ring-0 focus:outline-none sm:text-xl dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white"
                            />
                            {q.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQ('');
                                        inputRef.current?.focus();
                                    }}
                                    aria-label="Limpar termo de busca"
                                    className="absolute right-1 p-1 text-zinc-400 transition-colors hover:cursor-pointer hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="inline-flex shrink-0 items-center gap-2 bg-black px-4 py-2.5 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:cursor-pointer hover:bg-zinc-800 sm:px-5 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                            <span className="hidden sm:inline">Buscar</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Fechar barra de busca"
                            className="flex shrink-0 items-center justify-center border border-zinc-200 p-2 text-zinc-500 transition-colors hover:cursor-pointer hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
