import ExpandableImage from './expandable-image';

// Componente Gallery
interface GalleryProps {
    images: Array<{ uuid: string; path?: string }>;
    columns?: number;
    grid_cols?: string;
}

export default function Gallery({ images, columns = 2, grid_cols = 'grid-cols-2' }: GalleryProps) {
    const imageColumns = images.reduce(
        (acc, image, index) => {
            acc[index % columns].push(image);
            return acc;
        },
        Array.from({ length: columns }, () => []) as (typeof images)[],
    );

    return (
        <div className={`grid ${grid_cols} gap-4`}>
            {imageColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4">
                    {column.map((image) => (
                        <ExpandableImage
                            key={image.uuid}
                            src={`${image.path ? image.path : 'https://placehold.co/900x1280'}`}
                            alt="History Article Image"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
