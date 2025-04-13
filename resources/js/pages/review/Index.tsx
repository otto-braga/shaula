import PublicLayout from '@/layouts/public-layout';
import { useKeenSlider } from 'keen-slider/react';

import { Work } from '@/types/work';
import 'keen-slider/keen-slider.min.css';

export default function Index({ reviews }: { reviews: { data: Work[] } }) {
    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            slides: {
                perView: 3,
                spacing: 15,
            },
            breakpoints: {
                '(max-width: 768px)': {
                    slides: {
                        perView: 1,
                        spacing: 5,
                    },
                },
                '(min-width: 768px) and (max-width: 1024px)': {
                    slides: {
                        perView: 2,
                        spacing: 10,
                    },
                },
                '(min-width: 1024px)': {
                    slides: {
                        perView: 3,
                        spacing: 15,
                    },
                },
            },
        },
        [
            // add plugins here
            (slider) => {
                let timeout: number;
                let mouseOver = false;

                const clearNextTimeout = () => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                };

                const nextTimeout = () => {
                    clearNextTimeout();
                    timeout = window.setTimeout(() => {
                        if (instanceRef.current) {
                            instanceRef.current.next();
                        }
                    }, 2000);
                };

                slider.on('created', () => {
                    slider.container.addEventListener('mouseover', () => {
                        mouseOver = true;
                        clearNextTimeout();
                    });
                    slider.container.addEventListener('mouseout', () => {
                        mouseOver = false;
                        nextTimeout();
                    });
                    nextTimeout();
                });

                slider.on('dragStarted', clearNextTimeout);
                slider.on('animationEnded', () => {
                    if (!mouseOver) nextTimeout();
                });
                slider.on('updated', () => {
                    clearNextTimeout();
                    if (!mouseOver) nextTimeout();
                });
            },
        ],
    );

    console.log(reviews);

    return (
        <PublicLayout head="Crítica">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div ref={sliderRef} className="keen-slider max-h-[400px]">
                {reviews.data.map((review) => (
                    <div key={review.id} className="keen-slider__slide relative grid grid-cols-2 items-start gap-3">
                        <img
                            src={`${review.images[0] ? review.images[1].path : 'https://placehold.co/200x200'}`}
                            alt="Review Image"
                            className="h-full w-full object-cover"
                        />
                        <div className="">
                            <h2 className="font-semibold">{review.title}</h2>
                            <div className="space-x-1">
                                {review.authors.map((author) => (
                                    <span key={author.id} className="text-xs text-gray-500 underline">
                                        {author.name}
                                    </span>
                                ))}
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: review.content }} className="line-clamp-4 text-sm" />
                        </div>
                    </div>
                ))}
            </div>
        </PublicLayout>
    );
}
