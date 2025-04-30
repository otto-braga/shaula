import PublicLayout from '@/layouts/public-layout';
import { Artwork } from '@/types/artwork';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';

export default function Show({ artwork }: { artwork: { data: Artwork } }) {
    console.log(artwork);

    return (
        <PublicLayout head="Obra">
            <div className="divide-y">
                <div>
                    <img
                        src={`${artwork.data.primary_image ? artwork.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                        alt="Artwork Image"
                        className="aspect-square w-32 object-cover"
                    />
                </div>
                <div>{artwork.data.title}</div>
                <div>
                    <h2>sobre</h2>
                    <div dangerouslySetInnerHTML={{ __html: artwork.data.content }} className="pb-6 text-lg" />
                </div>
                <div>
                    <h2>autores</h2>
                    {artwork.data.authors.map((author) => (
                        <Link href={route('public.people.show', author.slug)} className="flex items-center space-x-2" key={author.id}>
                            <div key={author.id}>
                                <p>{author.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div>
                    <h2>categorias</h2>
                    {artwork.data.categories.map((category) => (
                        <div key={category.id}>
                            <p>{category.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
