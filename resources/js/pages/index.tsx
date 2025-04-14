import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PublicLayout from '@/layouts/public-layout';
import { Work } from '@/types/work';
import Autoplay from 'embla-carousel-autoplay';
import 'keen-slider/keen-slider.min.css';

export default function Index({ reviews, artworks }: { reviews: { data: Work[] }; artworks: { data: Work[] } }) {
    return (
        <PublicLayout head="SHAULA">
            <section className="w-full">
                <h2 className="text-3xl">Crítica</h2>
                <Carousel
                    opts={{
                        align: 'start',
                        // align: 'center',
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 3000,
                            stopOnInteraction: false,
                            // disableOnInteraction: false,
                        }),
                    ]}
                    className="relative mt-3"
                >
                    {/* <div className="absolute z-20 h-full w-[6%] bg-gradient-to-r from-white" /> */}
                    {/* <div className="absolute right-0 z-20 h-full w-[6%] bg-gradient-to-l from-white" /> */}
                    <CarouselContent className="-ml-8">
                        {reviews.data.map((review) => (
                            <CarouselItem key={review.id} className="basis-1/1 pl-8 md:basis-1/2 lg:basis-1/3">
                                <div className="bg-pink-100">
                                    <img
                                        src={`${review.images[0] ? review.images[1].path : 'https://placehold.co/1200x900'}`}
                                        alt="Review Image"
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-xl font-semibold">{review.title}</h2>
                                    <div className="space-x-1">
                                        {review.authors.map((author) => (
                                            <span key={author.id} className="text-gray-500 underline">
                                                {author.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: review.description }} className="mt-3 text-sm text-gray-600" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            </section>
        </PublicLayout>
    );
}
