import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Artwork } from '@/types/artwork';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';

export default function Show({ artwork }: { artwork: { data: Artwork } }) {
    console.log(artwork);
    const { data } = artwork;

    return (
        <PublicLayout head="Obra">
            <div className="container mx-auto px-4 py-8 md:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <img
                            src={`${data.primary_image ? data.primary_image.path : 'https://placehold.co/600x600'}`}
                            alt={data.title || 'Imagem da Obra'}
                            className="aspect-square w-full object-cover shadow-md"
                        />
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.title}</h1>

                        {data.content && (
                            <section>
                                <h2 className="mb-2 text-xl font-semibold text-gray-800">Sobre a Obra</h2>
                                <div
                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                    className="prose max-w-none text-gray-700" // 'prose' para estilização de HTML
                                />
                            </section>
                        )}

                        {data.authors && data.authors.length > 0 && (
                            <section className="border-t border-gray-200 pt-6">
                                <h2 className="mb-2 text-xl font-semibold text-gray-800">Autores</h2>
                                <ul className="space-y-1">
                                    {data.authors.map((author) => (
                                        <li key={author.uuid}>
                                            <Link
                                                href={route('public.people.show', author.slug)}
                                                className="text-gray-700 hover:text-gray-900 hover:underline"
                                            >
                                                {author.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {data.categories && data.categories.length > 0 && (
                            <section className="border-t border-gray-200 pt-6">
                                <h2 className="mb-2 text-xl font-semibold text-gray-800">Categorias</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.categories.map((category) => (
                                        <span key={category.uuid} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Você pode adicionar a seção de Períodos de forma similar se necessário */}
                    </div>
                </div>
            </div>
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
                    {artwork.data.date ? formatDate(artwork.data.date) : ''}
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
