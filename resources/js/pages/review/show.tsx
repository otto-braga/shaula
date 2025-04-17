import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';

import { Work } from '@/types/work';
import { Link } from '@inertiajs/react';

import 'keen-slider/keen-slider.min.css';

export default function Index({ review }: { review: { data: Work } }) {
    console.log(review);

    return (
        <PublicLayout head="Crítica">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}

            <div className="relative h-full max-h-[800px] w-full overflow-hidden">
                <img
                    src={`${review.data.general_images.length > 0 ? review.data.general_images[0].path : 'https://placehold.co/1280x900'}`}
                    alt="Review Image"
                    className="aspect-video w-full object-cover"
                />
                <div className="via-zinc-70 absolute bottom-1/4 left-1/2 z-20 flex justify-center bg-gradient-to-r from-zinc-900/20 via-zinc-400/50 to-zinc-900/40 p-1 backdrop-blur-lg">
                    <div>
                        <h1 className="font-semibold text-white md:text-3xl">{review.data.title}</h1>
                        <div className="flex gap-1">
                            {review.data.authors.map((author) => (
                                <Link href={route('person-public.show', author.id)} key={author.id}>
                                    <span className="text-gray-100 underline md:text-lg">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <section className="mt-8 grid gap-8 p-4 md:grid-cols-8 md:px-8">
                <div className="space-y-3 md:col-span-2 lg:col-span-2">
                    <div>
                        <p className="font-semibold">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('person-public.show', author.id)} key={author.id}>
                                <p className="hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {review.data.categories.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold">Categorias</p>
                            {review.data.categories.map((category) => (
                                <p>{category.name}</p>
                            ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <p className="font-semibold">Citações</p>
                        <p>Nome da pessoa</p>
                        <p>Nome da pessoa</p>
                    </div>
                </div>
                <div className="md:col-span-5 lg:col-span-4">
                    <div>
                        <span className="text-sm text-slate-500">{formatDate(review.data.date)}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: review.data.content }} className="mt-3 text-lg lg:text-xl" />
                </div>
                <div className="md:col-span-1 lg:col-span-2 lg:pl-20 xl:pl-32">
                    {review.data.general_images.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {review.data.general_images.map((image) => (
                                <img
                                    key={image.id}
                                    src={`${image.path ? image.path : 'https://placehold.co/1280x900'}`}
                                    alt="Review Image"
                                    className=""
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* <div className="flex gap-3">
                {review.data.general_images.map((image) => (
                    <div key={image.id} className="">
                        <img src={`${image.path ? image.path : 'https://placehold.co/1280x900'}`} alt="Review Image" className="max-h-[600px]" />
                    </div>
                ))}
            </div> */}
        </PublicLayout>
    );
}
