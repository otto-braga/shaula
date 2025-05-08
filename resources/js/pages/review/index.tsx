import PublicLayout from '@/layouts/public-layout';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { InfiniteScrollData } from '@/types/paginated-data';
import { Review } from '@/types/review';
import { Link, router, WhenVisible } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import 'keen-slider/keen-slider.min.css';
import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Index({
    reviews,
    filters,
    pagination,
    lastReviews,
}: {
    reviews: { data: Review[] };
    filters: { search: string };
    pagination: InfiniteScrollData;
    lastReviews: { data: Review[] };
}) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        router.get('/critica', { search, page: '' }, { preserveState: false });
    }

    const [reachEnd, setReachEnd] = useState(pagination.current_page >= pagination.last_page);

    useEffect(() => {
        setReachEnd(pagination.current_page >= pagination.last_page);
    }, [pagination]);

    console.log(reviews);

    return (
        <PublicLayout head="Crítica">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}

            <Carousel
                opts={{
                    // align: 'start',
                    align: 'center',
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: false,
                        jump: false,
                        // disableOnInteraction: false,
                    }),
                ]}
                className="relative mt-3"
            >
                <div className="absolute z-20 hidden h-full w-[6%] bg-gradient-to-r from-white md:block" />
                <div className="absolute right-0 z-20 hidden h-full w-[6%] bg-gradient-to-l from-white md:block" />
                <CarouselContent className="">
                    {lastReviews.data.map((review) => (
                        <CarouselItem key={review.id} className="relative basis-1/1 pl-4 md:basis-1/2">
                            <img
                                src={`${review.images.length > 0 ? review.images[0].path : 'https://placehold.co/1280x900'}`}
                                alt="Review Image"
                                className="aspect-video w-full object-cover"
                            />
                            <div className="absolute bottom-0 z-20 mt-3 flex w-full flex-col items-center justify-center p-4 text-center">
                                <h2 className="text-xl font-semibold text-white md:text-2xl">{review.title}</h2>
                                <div className="space-x-1">
                                    {review.authors.map((author) => (
                                        <span key={author.id} className="text-gray-200 underline">
                                            {author.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="absolute top-1/2 left-2 z-30" />
                    <CarouselNext className="absolute top-1/2 right-2 z-30" />
                </div>
            </Carousel>

            <div className="px-4 py-6 md:px-8">
                <div className="flex gap-1">
                    <Users />
                    <span>Editorial</span>
                </div>
            </div>

            <section className="grid grid-cols-1 px-4 pt-8 md:grid-cols-3 md:gap-8 md:px-8">
                <div className="mb-6 w-full md:col-span-1 md:mb-0">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar criticas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border-0 border-b-2 border-black px-3 py-2 text-lg ring-0 focus:ring-0 focus:outline-0"
                            />
                            <button type="submit" className="absolute right-0 bottom-1 bg-white p-2 hover:cursor-pointer">
                                <Search />
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-span-2 divide-y">
                    {reviews.data.map((review) => (
                        <Link href={route('public.reviews.show', review)}>
                            <div className="grid gap-3 space-y-3 py-6 md:grid-cols-2">
                                <div>
                                    <img
                                        src={`${review.images.length > 0 ? review.images[0].path : 'https://placehold.co/1280x900'}`}
                                        alt="Review Image"
                                        className="aspect-video w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">{review.title}</h2>
                                    <div className="space-x-1">
                                        {review.authors.map((author) => (
                                            <span key={author.id} className="text-gray-500 underline">
                                                {author.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: review.content }} className="mt-3 line-clamp-5 text-lg text-gray-600" />
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* <div className="mt-8 flex flex-wrap gap-2">
                        {reviews.meta.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`rounded border px-4 py-2 ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                                >
                                    {link.label === '&laquo; Previous' ? 'Anterior' : link.label === 'Next &raquo;' ? 'Próxima' : link.label}
                                </Link>
                            ) : (
                                <span key={index} className="cursor-not-allowed rounded border px-4 py-2 text-gray-400">
                                    {link.label}
                                </span>
                            ),
                        )}
                    </div> */}
                </div>
                <WhenVisible
                    buffer={100}
                    params={{
                        only: ['reviews', 'pagination'],
                        data: {
                            page: pagination.current_page + 1,
                        },
                    }}
                    fallback={'Carregando...'}
                    always={!reachEnd}
                >
                    test
                </WhenVisible>
            </section>
        </PublicLayout>
    );
}
