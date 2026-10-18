import { Artwork } from '@/types/artwork';
import { Link } from '@inertiajs/react';

interface ArtworkCardProps {
    artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
    const imageSrc =
        artwork.primary_image?.path ||
        (artwork.images && artwork.images.length > 0 ? artwork.images[0].path : 'https://placehold.co/800x800?text=Obra');

    return (
        <Link href={route('public.artworks.show', { artwork: artwork.slug })} className="group flex w-full max-w-full min-w-0 flex-col overflow-hidden">
            <div className="aspect-square w-full max-w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                    src={imageSrc}
                    alt={artwork.title}
                    className="h-full w-full max-w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="mt-3 flex w-full min-w-0 flex-1 flex-col break-words">
                <h3 className="line-clamp-2 text-base font-semibold break-words text-gray-900 group-hover:underline dark:text-gray-100">
                    {artwork.title}
                </h3>
                {artwork.authors && artwork.authors.length > 0 && (
                    <p className="mt-1 line-clamp-1 text-sm break-words text-gray-500 dark:text-gray-400">
                        {artwork.authors.map((author) => author.name).join(', ')}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default ArtworkCard;
