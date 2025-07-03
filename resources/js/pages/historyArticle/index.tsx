import PublicLayout from '@/layouts/public-layout';

import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowRight } from 'lucide-react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function Index({ historyArticles, periods }: { historyArticles: { data: HistoryArticle[] }; periods: { data: Period[] } }) {
    console.log(periods);

    return (
        <PublicLayout head="História">
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
                <CarouselContent className="max-h-[50vh]">
                    {historyArticles.data.map((review) => (
                        <CarouselItem key={review.uuid} className="relative basis-1/2 pl-4">
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
                    <CarouselPrevious className="absolute top-1/2 left-2 z-30 cursor-pointer" />
                    <CarouselNext className="absolute top-1/2 right-2 z-30 cursor-pointer" />
                </div>
            </Carousel>
            <section className="flex w-full items-center justify-center px-4 pt-8">
                <div className="max-w-2xl">
                    <div className="mt-3 divide-y">
                        {periods.data.map((period) => (
                            <Link href={route('public.periods.show', period)} key={period.uuid}>
                                <div className="group cursor-pointer space-y-3 border-l-1 border-slate-300 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-[1px] w-8 bg-slate-300" />
                                        <h2 className="text-2xl font-medium group-hover:underline md:text-3xl">{period.name}</h2>
                                    </div>
                                    <div className="space-y-3 pl-8">
                                        <div className="flex items-center gap-2 sm:text-lg md:text-xl">
                                            <span>{period.start_date}</span>
                                            <ArrowRight />
                                            <span>{period.end_date}</span>
                                        </div>
                                        <img
                                            src={`${period.primary_image ? period.primary_image?.path : 'https://placehold.co/1280x900'}`}
                                            alt="Review Image"
                                            className="aspect-video w-full object-cover"
                                        />
                                        <div
                                            dangerouslySetInnerHTML={{ __html: period.content }}
                                            className="mt-3 line-clamp-5 text-lg text-gray-600"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                {/* <div>
                    <div>
                        <h1 className="text-4xl font-medium">Periodização</h1>
                    </div>
                    <div className="mt-3 divide-y">
                        {periods.data.map((period) => (
                            <Link href={route('public.periods.show', period)} key={period.uuid}>
                                <div className="group cursor-pointer space-y-3 py-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-medium group-hover:underline md:text-3xl">{period.name}</h2>
                                        <div className="flex items-center gap-2 text-lg md:text-xl">
                                            <span>{period.start_date}</span>
                                            <ArrowRight />
                                            <span>{period.end_date}</span>
                                        </div>
                                    </div>
                                    <img
                                        src={`${period.primary_image ? period.primary_image?.path : 'https://placehold.co/1280x900'}`}
                                        alt="Review Image"
                                        className="aspect-video w-full object-cover"
                                    />
                                    <div dangerouslySetInnerHTML={{ __html: period.content }} className="mt-3 line-clamp-5 text-lg text-gray-600" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div> */}
            </section>
        </PublicLayout>
    );
}
