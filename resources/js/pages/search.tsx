import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PublicLayout from '@/layouts/public-layout';
import { SearchFilterOption } from '@/types/search-filter-option';
import { SearchResult } from '@/types/search-result';
import { typeLabelSearch } from '@/utils/type-label';
import { Link, router } from '@inertiajs/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ENTITY_TYPES = [
    { value: '', label: 'Todos' },
    { value: 'artworks', label: 'Obras' },
    { value: 'people', label: 'Pessoas' },
    { value: 'exhibits', label: 'Exposições' },
    { value: 'history_articles', label: 'Artigos de História' },
    { value: 'periods', label: 'Períodos' },
    { value: 'reviews', label: 'Críticas' },
    { value: 'sources', label: 'Fontes' },
] as const;

export default function Index({ q }: { q: string | null }) {
    const normalizedPropQ = q ?? '';
    const [inputQuery, setInputQuery] = useState(normalizedPropQ);
    const [activeQuery, setActiveQuery] = useState(normalizedPropQ);
    const [selectedType, setSelectedType] = useState<string>('');

    const [results, setResults] = useState<SearchResult[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [lastPage, setLastPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [fetchedFilter, setFetchedFilter] = useState<SearchFilterOption[]>([]);
    const [filter, setFilter] = useState<SearchFilterOption[]>([]);

    useEffect(() => {
        const nextQ = q ?? '';
        setInputQuery(nextQ);
        setActiveQuery(nextQ);
        setCurrentPage(1);
    }, [q]);

    useEffect(() => {
        const routeUrl = route('public.search.filter.fetch.options');

        fetch(routeUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const rawOptions: SearchFilterOption[] = Array.isArray(data?.data) ? data.data : [];
                const options = rawOptions.filter((option) => option.name === 'categories');
                setFetchedFilter(options);
                setFilter(
                    options.map((option) => ({
                        name: option.name,
                        value: [],
                        label: option.label,
                    })),
                );
            })
            .catch((error) => console.error('Error fetching filter data:', error));
    }, []);

    const appliedFilterNumber = useMemo(() => {
        return filter.reduce((acc, f) => acc + (f.value?.length ?? 0), 0);
    }, [filter]);

    const activeFilterJson = useMemo(() => {
        const nonEmpty = filter.filter((f) => f.value && f.value.length > 0);
        return nonEmpty.length > 0 ? JSON.stringify(nonEmpty) : '';
    }, [filter]);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        const params = new URLSearchParams();
        if (activeQuery) {
            params.set('q', activeQuery);
        }
        params.set('page', String(currentPage));
        params.set('page_size', '10');

        if (selectedType) {
            params.set('only', selectedType);
        }

        if (activeFilterJson) {
            params.set('filter', activeFilterJson);
        }

        const routeUrl = `${route('public.search.fetch.search')}?${params.toString()}`;

        fetch(routeUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setResults(Array.isArray(data?.results) ? data.results : []);
                setTotal(typeof data?.total === 'number' ? data.total : 0);
                setLastPage(Math.max(1, Number(data?.last_page) || 1));
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching search results:', error);
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [activeQuery, currentPage, selectedType, activeFilterJson]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputQuery.trim();
        setActiveQuery(trimmed);
        setCurrentPage(1);
        router.get(route('public.search'), trimmed ? { q: trimmed } : {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleFilterValue = useCallback((filterName: string, optionValue: string) => {
        setFilter((prev) =>
            prev.map((item) => {
                if (item.name !== filterName) return item;
                const exists = item.value.includes(optionValue);
                return {
                    ...item,
                    value: exists ? item.value.filter((v) => v !== optionValue) : [...item.value, optionValue],
                };
            }),
        );
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilter(
            fetchedFilter.map((option) => ({
                name: option.name,
                value: [],
                label: option.label,
            })),
        );
        setSelectedType('');
        setCurrentPage(1);
    }, [fetchedFilter]);

    const clearAll = useCallback(() => {
        setInputQuery('');
        setActiveQuery('');
        setSelectedType('');
        setFilter(
            fetchedFilter.map((option) => ({
                name: option.name,
                value: [],
                label: option.label,
            })),
        );
        setCurrentPage(1);
        router.get(route('public.search'), {}, { preserveState: true, preserveScroll: true, replace: true });
    }, [fetchedFilter]);

    const renderFilterControls = (idPrefix: string) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <h2 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                        Filtros
                    </h2>
                </div>
                {(appliedFilterNumber > 0 || selectedType !== '') && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-wider text-zinc-600 uppercase transition-colors hover:cursor-pointer hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                        <span>Limpar ({appliedFilterNumber + (selectedType ? 1 : 0)})</span>
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {fetchedFilter.length > 0 ? (
                <Accordion
                    type="multiple"
                    defaultValue={fetchedFilter.map((f) => f.name)}
                    className="divide-y divide-zinc-200 dark:divide-zinc-800"
                >
                    {fetchedFilter.map((filterOption) => {
                        const selectedForGroup =
                            filter.find((f) => f.name === filterOption.name)?.value ?? [];

                        return (
                            <AccordionItem
                                key={`${idPrefix}-${filterOption.name}`}
                                value={filterOption.name}
                                className="border-zinc-200 dark:border-zinc-800"
                            >
                                <AccordionTrigger className="py-3 text-sm font-semibold tracking-wider text-zinc-900 uppercase hover:cursor-pointer hover:no-underline dark:text-zinc-100">
                                    <div className="flex items-center gap-2">
                                        <span>{filterOption.label || filterOption.name}</span>
                                        {selectedForGroup.length > 0 && (
                                            <span className="inline-flex h-5 min-w-5 items-center justify-center bg-black px-1.5 text-[10px] font-bold text-white dark:bg-white dark:text-black">
                                                {selectedForGroup.length}
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-1 pb-4">
                                    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                                        {filterOption.value.map((val) => {
                                            const isChecked = selectedForGroup.includes(val);
                                            return (
                                                <label
                                                    key={`${idPrefix}-${filterOption.name}-${val}`}
                                                    className="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={val}
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            toggleFilterValue(filterOption.name, val)
                                                        }
                                                        className="mt-0.5 h-4 w-4 shrink-0 rounded-none border-zinc-300 accent-black focus:ring-0 dark:border-zinc-700 dark:accent-white"
                                                    />
                                                    <span
                                                        className={
                                                            isChecked
                                                                ? 'font-semibold text-black dark:text-white'
                                                                : ''
                                                        }
                                                    >
                                                        {val}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Nenhuma opção adicional de filtro disponível.
                </p>
            )}
        </div>
    );

    const hasSidebar = fetchedFilter.length > 0;

    return (
        <PublicLayout head={activeQuery ? `Busca: ${activeQuery}` : 'Busca'}>
            {hasSidebar && (
                <MobileDetailBar
                    title={
                        appliedFilterNumber > 0
                            ? `Filtros (${appliedFilterNumber})`
                            : 'Filtros'
                    }
                >
                    <div className="py-2">{renderFilterControls('mobile')}</div>
                </MobileDetailBar>
            )}

            {/* Editorial Header & Inline Search */}
            <header className="border-b border-zinc-200 px-4 py-8 md:px-8 md:py-12 dark:border-zinc-800">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                            Acervo &amp; Pesquisa
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                            {activeQuery
                                ? `Resultados para "${activeQuery}"`
                                : 'Explorar o Acervo'}
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="relative flex flex-1 items-center border border-zinc-300 bg-white focus-within:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-white">
                            <Search className="ml-3.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                value={inputQuery}
                                onChange={(e) => setInputQuery(e.target.value)}
                                placeholder="Pesquisar por título, nome ou palavra-chave..."
                                className="w-full border-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-0 focus:outline-none sm:text-base dark:text-zinc-100 dark:placeholder:text-zinc-500"
                            />
                            {inputQuery.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInputQuery('');
                                        if (activeQuery !== '') {
                                            setActiveQuery('');
                                            setCurrentPage(1);
                                            router.get(
                                                route('public.search'),
                                                {},
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    replace: true,
                                                },
                                            );
                                        }
                                    }}
                                    aria-label="Limpar busca"
                                    className="mr-2 p-1 text-zinc-400 transition-colors hover:cursor-pointer hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="inline-flex shrink-0 items-center justify-center bg-black px-6 py-2.5 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:cursor-pointer hover:bg-zinc-800 sm:py-3 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Entity Type Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {ENTITY_TYPES.map((typeOption) => {
                            const isActive = selectedType === typeOption.value;
                            return (
                                <button
                                    key={typeOption.value || 'all'}
                                    type="button"
                                    onClick={() => {
                                        setSelectedType(typeOption.value);
                                        setCurrentPage(1);
                                    }}
                                    className={`border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors hover:cursor-pointer ${
                                        isActive
                                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                                            : 'border-zinc-200 bg-transparent text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-300 dark:hover:text-zinc-100'
                                    }`}
                                >
                                    {typeOption.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Desktop Filter Sidebar */}
                    {hasSidebar && (
                        <aside className="hidden border-r border-zinc-200 p-6 lg:col-span-3 lg:block md:p-8 dark:border-zinc-800">
                            <div className="sticky top-24">
                                {renderFilterControls('desktop')}
                            </div>
                        </aside>
                    )}

                    {/* Results Column */}
                    <section
                        className={`p-4 sm:p-6 md:p-8 ${
                            hasSidebar ? 'lg:col-span-9' : 'lg:col-span-12'
                        }`}
                    >
                        {/* Results Summary Bar & Active Filter Chips */}
                        <div className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                {isLoading
                                    ? 'Buscando registros...'
                                    : `${total} ${total === 1 ? 'resultado encontrado' : 'resultados encontrados'}`}
                            </p>

                            {appliedFilterNumber > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {filter.map((group) =>
                                        group.value.map((val) => (
                                            <button
                                                key={`${group.name}-${val}`}
                                                type="button"
                                                onClick={() => toggleFilterValue(group.name, val)}
                                                className="inline-flex items-center gap-1.5 border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800 transition-colors hover:cursor-pointer hover:border-black hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-white"
                                            >
                                                <span>{val}</span>
                                                <X className="h-3 w-3" />
                                            </button>
                                        )),
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Results List */}
                        {isLoading ? (
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {[1, 2, 3, 4].map((skeleton) => (
                                    <div
                                        key={skeleton}
                                        className="flex animate-pulse flex-col gap-5 py-6 sm:flex-row"
                                    >
                                        <div className="aspect-4/3 w-full shrink-0 bg-zinc-100 sm:w-44 md:w-52 dark:bg-zinc-900" />
                                        <div className="flex-1 space-y-3 py-1">
                                            <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900" />
                                            <div className="h-6 w-3/4 bg-zinc-100 dark:bg-zinc-900" />
                                            <div className="h-4 w-1/3 bg-zinc-100 dark:bg-zinc-900" />
                                            <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-900" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {results.map((item: SearchResult, index: number) => {
                                    const itemTitle =
                                        item.title || item.name || item.label || '[Sem título]';
                                    const itemTypeLabel = item.type
                                        ? typeLabelSearch(item.type)
                                        : '';
                                    const isExternalSource =
                                        item.type === 'sources' && Boolean(item.file_path || item.route);
                                    const targetHref =
                                        item.type === 'sources'
                                            ? item.file_path || item.route || '#'
                                            : item.route || '#';
                                    const hasImage = Boolean(
                                        item.primary_image_path && item.primary_image_url,
                                    );

                                    const metaPills = [
                                        ...(item.periods ?? []),
                                        ...(item.categories ?? []),
                                        ...(item.cities ?? []),
                                    ].slice(0, 4);

                                    return (
                                        <article
                                            key={item.uuid || `${item.type}-${index}`}
                                            className="group flex flex-col items-start gap-5 py-6 first:pt-2 sm:flex-row"
                                        >
                                            {hasImage && (
                                                <div className="aspect-4/3 w-full shrink-0 overflow-hidden border border-zinc-200 bg-zinc-100 sm:w-44 md:w-52 dark:border-zinc-800 dark:bg-zinc-900">
                                                    {isExternalSource ? (
                                                        <a
                                                            href={targetHref}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block h-full w-full"
                                                        >
                                                            <img
                                                                src={item.primary_image_url}
                                                                alt={itemTitle}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            href={targetHref}
                                                            className="block h-full w-full"
                                                        >
                                                            <img
                                                                src={item.primary_image_url}
                                                                alt={itemTitle}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        </Link>
                                                    )}
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1 space-y-2.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {itemTypeLabel && (
                                                        <span className="border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold tracking-widest text-zinc-600 uppercase dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                                                            {itemTypeLabel}
                                                        </span>
                                                    )}
                                                    {metaPills.map((pill, pillIdx) => (
                                                        <span
                                                            key={`${pill}-${pillIdx}`}
                                                            className="text-xs text-zinc-500 dark:text-zinc-400"
                                                        >
                                                            • {pill}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div>
                                                    {isExternalSource ? (
                                                        <a
                                                            href={targetHref}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xl font-bold tracking-tight text-zinc-900 group-hover:underline sm:text-2xl dark:text-zinc-100"
                                                        >
                                                            <span>{itemTitle}</span>
                                                            <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" />
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            href={targetHref}
                                                            className="block text-xl font-bold tracking-tight text-zinc-900 group-hover:underline sm:text-2xl dark:text-zinc-100"
                                                        >
                                                            {itemTitle}
                                                        </Link>
                                                    )}

                                                    {item.authors && item.authors.length > 0 && (
                                                        <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                                            {item.authors.join(', ')}
                                                        </p>
                                                    )}
                                                </div>

                                                {item.content && (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.content,
                                                        }}
                                                        className="line-clamp-3 text-sm leading-relaxed text-zinc-600 no-underline dark:text-zinc-400"
                                                    />
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
                                <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                                    Nenhum resultado encontrado
                                    {activeQuery ? ` para "${activeQuery}"` : ''}.
                                </p>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    Tente ajustar os termos da pesquisa ou remover os filtros selecionados.
                                </p>
                                {(activeQuery || appliedFilterNumber > 0 || selectedType) && (
                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="mt-6 inline-flex items-center gap-2 border border-zinc-900 bg-black px-5 py-2.5 text-xs font-semibold tracking-widest text-white uppercase transition-colors hover:cursor-pointer hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    >
                                        Limpar busca e filtros
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Monochrome Editorial Pagination */}
                        {!isLoading && lastPage > 1 && (
                            <nav
                                aria-label="Paginação de resultados"
                                className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage((p) => Math.max(1, p - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage <= 1}
                                    className="inline-flex items-center gap-1.5 border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-zinc-900 uppercase transition-colors hover:cursor-pointer hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-300 disabled:hover:bg-white disabled:hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-white dark:hover:bg-white dark:hover:text-black dark:disabled:hover:border-zinc-700 dark:disabled:hover:bg-zinc-900 dark:disabled:hover:text-zinc-100"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Anterior</span>
                                </button>

                                <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
                                    Página {currentPage} de {lastPage}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage((p) => Math.min(lastPage, p + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage >= lastPage}
                                    className="inline-flex items-center gap-1.5 border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-zinc-900 uppercase transition-colors hover:cursor-pointer hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-300 disabled:hover:bg-white disabled:hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-white dark:hover:bg-white dark:hover:text-black dark:disabled:hover:border-zinc-700 dark:disabled:hover:bg-zinc-900 dark:disabled:hover:text-zinc-100"
                                >
                                    <span>Próxima</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </nav>
                        )}
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
