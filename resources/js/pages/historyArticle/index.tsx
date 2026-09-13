import PublicLayout from '@/layouts/public-layout';

import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowRight } from 'lucide-react';

import FeaturedCarousel from '@/components/public/featured-carousel';

export default function Index({ historyArticles, periods }: { historyArticles: { data: HistoryArticle[] }; periods: { data: Period[] } }) {
    return (
        <PublicLayout head="História">
            <FeaturedCarousel
                items={historyArticles.data}
                getHref={(article) => route('public.history_articles.show', { historyArticle: article.slug })}
            />
            <section className="flex w-full items-center justify-center px-4 pt-8">
                <div className="max-w-2xl">
                    <div className="mt-3 divide-y">
                        {periods.data.map((period) => (
                            <Link href={route('public.periods.show', period)} key={period.uuid}>
                                <div className="group cursor-pointer space-y-3 border-l-1 border-slate-300 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-[1px] w-8 bg-slate-300" />
                                        <h2 className="text-2xl font-medium group-hover:underline md:text-3xl">{period.name}</h2>
                                    </div>
                                    <div className="space-y-3 pl-8">
                                        <div className="flex items-center gap-2 sm:text-lg md:text-xl">
                                            <span>{period.start_date}</span>
                                            <ArrowRight />
                                            <span>{period.end_date}</span>
                                        </div>
                                        <img
                                            src={`${period.primary_image ? period.primary_image?.path : 'https://placehold.co/1280x900'}`}
                                            alt="Review Image"
                                            className="aspect-video w-full object-cover"
                                        />
                                        <div
                                            dangerouslySetInnerHTML={{ __html: period.content }}
                                            className="mt-3 line-clamp-5 text-lg text-gray-600"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                {/* <div>
                    <div>
                        <h1 className="text-4xl font-medium">Periodização</h1>
                    </div>
                    <div className="mt-3 divide-y">
                        {periods.data.map((period) => (
                            <Link href={route('public.periods.show', period)} key={period.uuid}>
                                <div className="group cursor-pointer space-y-3 py-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-medium group-hover:underline md:text-3xl">{period.name}</h2>
                                        <div className="flex items-center gap-2 text-lg md:text-xl">
                                            <span>{period.start_date}</span>
                                            <ArrowRight />
                                            <span>{period.end_date}</span>
                                        </div>
                                    </div>
                                    <img
                                        src={`${period.primary_image ? period.primary_image?.path : 'https://placehold.co/1280x900'}`}
                                        alt="Review Image"
                                        className="aspect-video w-full object-cover"
                                    />
                                    <div dangerouslySetInnerHTML={{ __html: period.content }} className="mt-3 line-clamp-5 text-lg text-gray-600" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div> */}
            </section>
        </PublicLayout>
    );
}
