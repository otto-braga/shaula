import { SourceCard } from '@/components/ui/source-card';
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
                        src={`${artwork.data. primary_image ? artwork.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                        alt="Artwork Image"
                        className="aspect-square w-32 object-cover"
                    />
                </div>
                <div>{artwork.data.title}</div>
                <div className="text-gray-500">
                    {artwork.data.date ? new Date(artwork.data.date).toLocaleDateString() : ''}
                </div>
                <div className="text-gray-500">
                    {artwork.data.year ? artwork.data.year : ''}
                </div>
                <div className="text-gray-500">
                    {artwork.data.dimensions ? artwork.data.dimensions : ''}
                </div>
                <div className="text-gray-500">
                    {artwork.data.materials ? artwork.data.materials : ''}
                </div>
                <br />
                <div>
                    <h2>sobre</h2>
                    <div dangerouslySetInnerHTML={{ __html: artwork.data.content }} className="pb-6 text-lg" />
                </div>
                <br />
                <div>
                    <h2>autores</h2>
                    {artwork.data.authors.map((author) => (
                        <Link href={route('public.people.show', author.slug)} className="flex items-center space-x-2" key={author.uuid}>
                            <div key={author.uuid}>
                                <p>{author.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <br />
                <div>
                    <h2>categorias</h2>
                    {artwork.data.categories.map((category) => (
                        <div key={category.uuid}>
                            <p>{category.name}</p>
                        </div>
                    ))}
                </div>
                <br />
                <div>
                    <h2>periodos</h2>
                    {artwork.data.periods.map((period) => (
                        <div key={period.uuid}>
                            <p>{period.name}</p>
                        </div>
                    ))}
                </div>
                <br />
                <div>
                    <h2>menções</h2>
                    {artwork.data.mentions.map((mention, index) => (
                        <div key={'mention' + index}>
                            <p>
                                <Link href={mention.route} className="hover:underline">
                                    {mention.name}
                                </Link>
                            </p>
                        </div>
                    ))}
                </div>
                <br />
                <div>
                    <h2>fontes</h2>
                    {artwork.data.sources.map((source, index) => (
                        <div key={'source' + index}>
                            <SourceCard source={source} />
                        </div>
                    ))}
                </div>
                <br />
            </div>
        </PublicLayout>
    );
}
