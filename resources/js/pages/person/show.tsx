import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Person } from '@/types/person';
import { Link } from '@inertiajs/react';

export default function Index({ person }: { person: { data: Person } }) {
    console.log(person);
    return (
        <PublicLayout head={person.data.name}>
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div className="grid p-4 md:grid-cols-5 md:gap-3 md:p-8">
                {/* vazio */}
                <section className=""></section>
                {/* foto e info */}
                <section className="">
                    <div className="">
                        <div>
                            <img
                                src={`${person.data.primary_image ? person.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                                alt="person Image"
                                className="aspect-square w-full object-cover"
                            />
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-medium">{person.data.name}</h2>
                        </div>
                        <div className="mt-6 space-y-2">
                            {person.data.cities.length > 0 && (
                                <div>
                                    <p className="font-medium">Cidades</p>
                                    {person.data.cities.map((city) => (
                                        <p key={city.id}>{city.name}</p>
                                    ))}
                                </div>
                            )}
                            {person.data.date_of_birth && (
                                <div>
                                    <p className="font-medium">Nascimento</p>
                                    <p>{formatDate(person.data.date_of_birth)}</p>
                                </div>
                            )}
                            {person.data.date_of_death && (
                                <div>
                                    <p className="font-medium">Falecimento</p>
                                    <p>{formatDate(person.data.date_of_death)}</p>
                                </div>
                            )}
                            <div>
                                <p className="font-medium">Links</p>
                                <p>https://www.jotamombaca.com/</p>
                                <p>https://instagram.com/jotamombaça</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* vazio */}
                <section></section>
                {/* 2cols com sobre e producoes */}
                <section className="space-y-6 divide-y pb-3 md:col-span-2">
                    <div dangerouslySetInnerHTML={{ __html: person.data.content }} className="pb-6 text-lg" />

                    {person.data.reviews.length > 0 && (
                        <div className="pb-6">
                            <h2 className="mb-6 text-xl font-medium">CRÍTICAS</h2>
                            <div className="group grid cursor-pointer grid-cols-1 gap-4">
                                {person.data.reviews.map((review) => (
                                    <Link href={route('public.reviews.show', review)} key={review.id}>
                                        <div key={review.id} className="flex items-start gap-3">
                                            <img
                                                src={`${review.primary_image ? review.primary_image.path : 'https://placehold.co/1280x900'}`}
                                                alt="Review Image"
                                                // className="aspect-square w-full object-cover"
                                                className="h-24 w-24 object-cover"
                                            />
                                            <div className="w-full">
                                                <h3 className="text-xl group-hover:underline">{review.title}</h3>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: review.content }}
                                                    className="line-clamp-3 text-sm text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {person.data.artworks.length > 0 && (
                        <div className="pb-6">
                            <h2 className="mb-6 text-xl font-medium">OBRAS</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                                {person.data.artworks.map((artwork) => (
                                    <Link href={route('public.artworks.show', artwork.slug)} key={artwork.id}>
                                        <div key={artwork.id} className="relative">
                                            <img
                                                src={`${artwork.primary_image ? artwork.primary_image.path : 'https://placehold.co/1280x900'}`}
                                                alt="artwork Image"
                                                className="w-full"
                                            />
                                            <div className="mt-3">
                                                <h3 className="text-lg">{artwork.title}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
