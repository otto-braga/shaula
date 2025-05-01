import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Person } from '@/types/person';
import { Link } from '@inertiajs/react';

import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import 'keen-slider/keen-slider.min.css';

export default function Index({ person }: { person: { data: Person } }) {
    return (
        <PublicLayout head={person.data.name}>
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div className="grid p-4 md:grid-cols-5 md:gap-6 md:divide-x-1 md:p-8">
                {/* foto e info */}
                <section className="md:pr-6">
                    <div className="md:sticky md:top-24">
                        <div>
                            <img
                                src={`${person.data.primary_image ? person.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                                alt="person Image"
                                className="aspect-square w-full object-cover"
                            />
                        </div>
                        <div className="mt-3 md:mt-6">
                            <h2 className="text-2xl font-medium">{person.data.name}</h2>
                        </div>
                        <div className="mt-3 space-y-2">
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
                                <p className="truncate">https://www.jotamombaca.com/</p>
                                <p className="truncate">https://instagram.com/jotamombaça</p>
                            </div>
                        </div>
                    </div>
                </section>
                e{/* bio e crono */}
                <section className="mt-6 border-t pt-4 md:col-span-2 md:mt-0 md:border-t-0 md:pt-0 md:pr-4">
                    <div className="md:sticky md:top-24">
                        <div className="space-y-1">
                            <h2 className="font-medium">Biografia</h2>
                            <div dangerouslySetInnerHTML={{ __html: person.data.content }} className="pb-6 text-lg" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-medium">Cronologia</h2>
                            <div dangerouslySetInnerHTML={{ __html: person.data.content }} className="pb-6 text-lg" />
                        </div>
                    </div>
                </section>
                {/* 2cols com sobre e producoes */}
                <section className="space-y-6 divide-y border-t pt-6 pb-3 md:col-span-2 md:border-0 md:pt-0">
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
                        <div>
                            <h2 className="mb-6 text-xl font-medium">OBRAS</h2>
                            <LightGallery speed={500} elementClassNames="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
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
                            </LightGallery>
                        </div>
                        // <div className="pb-6">
                        //     <h2 className="mb-6 text-xl font-medium">OBRAS</h2>
                        //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        //         {person.data.artworks.map((artwork) => (
                        //             <Link href={route('public.artworks.show', artwork.slug)} key={artwork.id}>
                        //                 <div key={artwork.id} className="relative">
                        //                     <img
                        //                         src={`${artwork.primary_image ? artwork.primary_image.path : 'https://placehold.co/1280x900'}`}
                        //                         alt="artwork Image"
                        //                         className="w-full"
                        //                     />
                        //                     <div className="mt-3">
                        //                         <h3 className="text-lg">{artwork.title}</h3>
                        //                     </div>
                        //                 </div>
                        //             </Link>
                        //         ))}
                        //     </div>
                        // </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
