import PublicLayout from '@/layouts/public-layout';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Work } from '@/types/work';

import Autoplay from 'embla-carousel-autoplay';
import 'keen-slider/keen-slider.min.css';

export default function Index({ artworks }: { artworks: { data: Work[] } }) {
    console.log(artworks);

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
                <div className="absolute z-20 h-full w-[6%] bg-gradient-to-r from-white" />
                <div className="absolute right-0 z-20 h-full w-[6%] bg-gradient-to-l from-white" />
                <CarouselContent className="">
                    {artworks.data.map((review) => (
                        <CarouselItem key={review.id} className="relative basis-1/2 pl-4">
                            <img
                                src={`${review.images[0] ? review.images[1].path : 'https://placehold.co/1280x900'}`}
                                alt="Review Image"
                                className="aspect-video w-full object-cover"
                            />
                            <div className="absolute bottom-0 z-20 mt-3 w-full p-4 text-center">
                                <h2 className="text-2xl font-semibold text-white">{review.title}</h2>
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
                <div className="mt-3 flex justify-center">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>

            <section className="mt-20 grid gap-8 border-t pt-12 md:grid-cols-3">
                <div className="col-span-1">
                    <div className="h-full w-full bg-black/10">FILTROS</div>
                </div>
                <div className="col-span-2 divide-y">
                    {artworks.data.map((review) => (
                        <div className="grid grid-cols-2 gap-3 space-y-3 py-6">
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
