import PublicLayout from '@/layouts/public-layout';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Work } from '@/types/work';

import Autoplay from 'embla-carousel-autoplay';
import 'keen-slider/keen-slider.min.css';
import { Users } from 'lucide-react';

export default function Index({ reviews }: { reviews: { data: Work[] } }) {
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
                    {reviews.data.map((review) => (
                        <CarouselItem key={review.id} className="relative basis-1/1 pl-4 md:basis-1/2">
                            <img
                                src={`${review.images[0] ? review.images[1].path : 'https://placehold.co/1280x900'}`}
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
                                <div dangerouslySetInnerHTML={{ __html: review.description }} className="mt-3 text-sm text-gray-600" />
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

            <section className="grid gap-8 px-4 pt-8 md:grid-cols-3 md:px-8">
                <div className="col-span-1">
                    <div className="h-full w-full bg-black/10"></div>
                </div>
                <div className="col-span-2 divide-y">
                    {reviews.data.map((review) => (
                        <div className="grid gap-3 space-y-3 py-6 md:grid-cols-2">
                            <div>
                                <img
                                    src={`${review.images[0] ? review.images[1].path : 'https://placehold.co/1280x900'}`}
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
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
