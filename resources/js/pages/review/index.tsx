import PublicLayout from '@/layouts/public-layout';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { PaginatedData } from '@/types/paginated-data';
import { Review } from '@/types/review';
import { Link, router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import 'keen-slider/keen-slider.min.css';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Index({
    reviews,
    // filters,
    lastReviews,
}: {
    reviews: PaginatedData<Review>;
    // filters: { search: string };
    lastReviews: { data: Review[] };
}) {
    // const [search, setSearch] = useState(filters.search || '');

    // function handleSearch(e: React.FormEvent) {
    //     e.preventDefault();

    //     router.get('/critica', { search }, { preserveState: true });
    // }

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
                {/* <div className="absolute z-20 hidden h-full w-[6%] bg-gradient-to-r from-white md:block" /> */}
                {/* <div className="absolute right-0 z-20 hidden h-full w-[6%] bg-gradient-to-l from-white md:block" /> */}
                <CarouselContent className="max-h-[90vh]">
                    {lastReviews.data.map((review) => (
                        <CarouselItem key={review.uuid} className="relative basis-1/1 pl-4">
                            <img
                                src={`${review.images.length > 0 ? review.images[0].path : 'https://placehold.co/1280x900'}`}
                                alt="Review Image"
                                className="aspect-video w-full object-cover"
                            />
                            <div className="absolute bottom-4 z-20 mt-3 flex w-full flex-col items-center justify-center p-4 text-center">
                                <h2 className="text-xl font-semibold text-white md:text-3xl">{review.title}</h2>
                                <div className="space-x-1">
                                    {review.authors.map((author) => (
                                        <span key={author.uuid} className="text-gray-200 underline">
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

            <section className="grid grid-cols-1 divide-x px-4 pt-8 md:grid-cols-8 md:gap-8 md:px-8">
                <div className="mb-6 w-full pr-8 md:col-span-2 md:mb-0">
                    {/* <Tabs defaultValue="about">
                        <TabsList className="0 flex justify-evenly divide-x">
                            <TabsTrigger value="about" className="flex w-full items-center justify-center gap-1 hover:cursor-pointer">
                                <Users />
                                <span>Editorial</span>
                            </TabsTrigger>
                            <TabsTrigger value="filters" className="flex w-full items-center justify-center gap-1 hover:cursor-pointer">
                                <Filter />
                                <span>Filtros</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="about">
                            <div className="mt-3 space-y-6">
                                <p className="max-w-sm text-justify text-sm">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam accusamus tenetur doloribus perspiciatis
                                    consequatur accusantium amet voluptatem odio. Molestias ullam, nisi accusamus velit recusandae deleniti voluptates
                                    aut corrupti explicabo libero. Reiciendis repellendus quod ipsa, molestias et harum eaque quae.
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-medium">Editora Chefe</p>
                                        <p>Fabíola Alves</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Editora Jr. / Redatora</p>
                                        <p>Maria Sucar</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="filters">
                            <div className="mt-3 divide-y">
                                <div className="flex justify-between py-3">
                                    <p>Categorias</p>
                                    <ChevronDown />
                                </div>
                                <div className="flex justify-between py-3">
                                    <p>Autores</p>
                                    <ChevronDown />
                                </div>
                                <div className="flex justify-between py-3">
                                    <p>Data de publicação</p>
                                    <ChevronDown />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs> */}
                    <div className="mt-3 space-y-6">
                        <h1 className="font-medium">SHAULA - CRÍTICA</h1>
                        <p className="max-w-sm text-justify">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam accusamus tenetur doloribus perspiciatis consequatur
                            accusantium amet voluptatem odio. Molestias ullam, nisi accusamus velit recusandae deleniti voluptates aut corrupti
                            explicabo libero. Reiciendis repellendus quod ipsa, molestias et harum eaque quae.
                        </p>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium">Editora Chefe</p>
                                <p>Fabíola Alves</p>
                            </div>
                            <div>
                                <p className="font-medium">Editora Jr. / Redatora</p>
                                <p>Maria Sucar</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divide-y md:col-span-5 md:pr-8">
                    {/* <div className="mb-6 w-full md:col-span-1 md:mb-0">
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
                    </div> */}
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
                                            <span key={author.uuid} className="text-gray-500 underline">
                                                {author.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: review.content }} className="mt-3 line-clamp-5 text-lg text-gray-600" />
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {reviews.meta.links.map((link, index) =>
                            link.url ? (
                                <Link key={index} href={link.url} className={`px-4 py-2 ${link.active ? 'font-semibold' : 'bg-white text-gray-500'}`}>
                                    {link.label === '&laquo; Previous' ? (
                                        <>
                                            <ChevronLeft />
                                        </>
                                    ) : link.label === 'Next &raquo;' ? (
                                        <>
                                            <ChevronRight />
                                        </>
                                    ) : (
                                        link.label
                                    )}
                                </Link>
                            ) : (
                                <></>
                            ),
                        )}
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="divide-y">
                        <div className="flex justify-between py-3">
                            <p>Categorias</p>
                            <ChevronDown />
                        </div>
                        <div className="flex justify-between py-3">
                            <p>Autores</p>
                            <ChevronDown />
                        </div>
                        <div className="flex justify-between py-3">
                            <p>Data de publicação</p>
                            <ChevronDown />
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
