import PublicLayout from '@/layouts/public-layout';
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
                                        <li key={author.id}>
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
                                        <span key={category.id} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
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
        </PublicLayout>
    );
}
