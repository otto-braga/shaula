import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FileProps } from '@/types/file';
import { Person } from '@/types/person';
import { Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';

export interface FeaturedCarouselItem {
    uuid: string;
    slug: string;
    title: string;
    primary_image?: FileProps | null;
    images?: FileProps[];
    authors?: Person[];
}

interface FeaturedCarouselProps<T extends FeaturedCarouselItem> {
    items: T[];
    getHref: (item: T) => string;
    maxItems?: number;
    className?: string;
}

export function FeaturedCarousel<T extends FeaturedCarouselItem>({
    items,
    getHref,
    maxItems = 5,
    className = 'relative mt-3',
}: FeaturedCarouselProps<T>) {
    const displayItems = items.slice(0, maxItems);

    if (!displayItems.length) {
        return null;
    }

    return (
        <Carousel
            opts={{
                align: 'center',
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: false,
                    jump: false,
                }),
            ]}
            className={className}
        >
            <CarouselContent className="max-h-[50vh]">
                {displayItems.map((item) => {
                    const imageSrc =
                        item.primary_image?.path || (item.images && item.images.length > 0 ? item.images[0].path : 'https://placehold.co/1280x900');

                    return (
                        <CarouselItem key={item.uuid} className="basis-full md:basis-1/2">
                            <Link href={getHref(item)} className="group relative block w-full overflow-hidden">
                                <img
                                    src={imageSrc}
                                    alt={item.title}
                                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-center p-3 text-center sm:p-4 md:bottom-4 md:p-6">
                                    <h2 className="line-clamp-2 max-w-full text-base font-semibold break-words text-white group-hover:underline sm:line-clamp-2 sm:text-lg md:line-clamp-3 md:text-2xl lg:text-3xl">
                                        {item.title}
                                    </h2>
                                    {item.authors && item.authors.length > 0 && (
                                        <div className="mt-1 flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-gray-200 sm:text-sm">
                                            {item.authors.map((author) => (
                                                <span key={author.uuid} className="underline">
                                                    {author.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <div className="hidden md:block">
                <CarouselPrevious className="absolute top-1/2 left-2 z-30 -translate-y-1/2 cursor-pointer" />
                <CarouselNext className="absolute top-1/2 right-2 z-30 -translate-y-1/2 cursor-pointer" />
            </div>
        </Carousel>
    );
}

export default FeaturedCarousel;
