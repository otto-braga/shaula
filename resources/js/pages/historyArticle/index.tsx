import PublicLayout from '@/layouts/public-layout';

import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';

export default function Index({ historyArticles, periods }: { historyArticles: { data: HistoryArticle[] }; periods: { data: Period[] } }) {
    console.log(periods);

    return (
        <PublicLayout head="História">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}

            <section className="grid gap-8 px-4 pt-8 md:grid-cols-3 md:px-8">
                <div className="col-span-2 divide-y">
                    {periods.data.map((period) => (
                        <Link href={route('public.periods.show', period)}>
                            <div className="grid gap-3 space-y-3 py-6 md:grid-cols-2">
                                <div>
                                    {/* <img
                                        src={`${period.images.length > 0 ? period.images[0].path : 'https://placehold.co/1280x900'}`}
                                        alt="Review Image"
                                        className="aspect-video w-full object-cover"
                                    /> */}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">{period.name}</h2>
                                    <div className="space-x-1"></div>
                                    <div dangerouslySetInnerHTML={{ __html: period.content }} className="mt-3 line-clamp-5 text-lg text-gray-600" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="col-span-2 divide-y">
                    {historyArticles.data.map((article) => (
                        <Link href={route('public.historyArticles.show', article)}>
                            <div className="grid gap-3 space-y-3 py-6 md:grid-cols-2">
                                <div>
                                    <img
                                        src={`${article.images.length > 0 ? article.images[0].path : 'https://placehold.co/1280x900'}`}
                                        alt="Review Image"
                                        className="aspect-video w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold">{article.title}</h2>
                                    <div className="space-x-1">
                                        {article.authors.map((author) => (
                                            <span key={author.id} className="text-gray-500 underline">
                                                {author.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} className="mt-3 line-clamp-5 text-lg text-gray-600" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="col-span-1">
                    <div className="h-full w-full bg-black/10"></div>
                </div>
            </section>
        </PublicLayout>
    );
}
