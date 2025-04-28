import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { HistoryArticle } from '@/types/history-article';

import { Link } from '@inertiajs/react';

import 'keen-slider/keen-slider.min.css';

export default function Show({ historyArticle }: { historyArticle: { data: HistoryArticle } }) {
    console.log(historyArticle);

    return (
        <PublicLayout head="Crítica">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}

            <div className="relative h-full max-h-[800px] w-full overflow-hidden">
                <img
                    src={`${historyArticle.data.primary_image ? historyArticle.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                    alt="Review Image"
                    className="aspect-video w-full object-cover"
                />
                <div className="via-zinc-70 absolute bottom-1/4 left-1/2 z-20 flex justify-center bg-gradient-to-r from-zinc-900/20 via-zinc-400/50 to-zinc-900/40 p-1 backdrop-blur-lg">
                    <div>
                        <h1 className="font-semibold text-white md:text-3xl">{historyArticle.data.title}</h1>
                        <div className="flex gap-1">
                            {historyArticle.data.authors.map((author) => (
                                <Link href={route('person-public.show', author.slug)} key={author.id}>
                                    <span className="text-gray-100 hover:underline md:text-lg">{author.name}</span>
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
                        {/* {historyArticle.data.authors.map((author) => (
                            <Link href={route('person-public.show', author.slug)} key={author.id}>
                                <p className="hover:underline">{author.name}</p>
                            </Link>
                        ))} */}
                    </div>
                    {historyArticle.data.categories.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold">Categorias</p>
                            {historyArticle.data.categories.map((category) => (
                                <p>{category.name}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="md:col-span-5 lg:col-span-4">
                    <div>
                        <span className="text-sm text-slate-500">{formatDate(historyArticle.data.date)}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: historyArticle.data.content }} className="mt-3 text-lg lg:text-xl" />
                </div>
                <div className="md:col-span-1 lg:col-span-2 lg:pl-20 xl:pl-32">
                    {historyArticle.data.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {historyArticle.data.images.map((image) => (
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
        </PublicLayout>
    );
}
