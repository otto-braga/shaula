import { Review } from '@/types/review';
import { Link } from '@inertiajs/react';

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const imageSrc =
        review.primary_image?.path ||
        (review.images && review.images.length > 0 ? review.images[0].path : 'https://placehold.co/1200x900');

    return (
        <Link href={route('public.reviews.show', review)} className="group flex h-full flex-col">
            <div className="overflow-hidden bg-pink-100 dark:bg-zinc-800">
                <img
                    src={imageSrc}
                    alt={review.title}
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="mt-3 flex flex-1 flex-col">
                <h3 className="text-center text-2xl font-semibold group-hover:underline dark:text-gray-100">
                    {review.title}
                </h3>
                {review.authors && review.authors.length > 0 && (
                    <div className="mt-1 space-x-1 text-center">
                        {review.authors.map((author) => (
                            <span key={author.uuid} className="text-gray-500 dark:text-gray-400">
                                {author.name}
                            </span>
                        ))}
                    </div>
                )}
                {review.content && (
                    <div
                        dangerouslySetInnerHTML={{ __html: review.content }}
                        className="mt-3 line-clamp-5 text-gray-600 no-underline dark:text-gray-300"
                    />
                )}
            </div>
        </Link>
    );
}

export default ReviewCard;
