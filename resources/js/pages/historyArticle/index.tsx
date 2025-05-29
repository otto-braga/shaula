import PublicLayout from '@/layouts/public-layout';

import { HistoryArticle } from '@/types/historyArticle';
import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowRight } from 'lucide-react';

export default function Index({ historyArticles, periods }: { historyArticles: { data: HistoryArticle[] }; periods: { data: Period[] } }) {
    console.log(periods);

    return (
        <PublicLayout head="História">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}

            <section className="grid gap-8 px-4 pt-8 md:grid-cols-3 md:px-8">
                <div></div>
                <div>
                    <div>
                        <h1 className="text-4xl font-bold">Períodos</h1>
                    </div>
                    <div className="mt-3 divide-y">
                        {periods.data.map((period) => (
                            <Link href={route('public.periods.show', period)} key={period.id}>
                                <div className="group cursor-pointer space-y-3 py-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-medium group-hover:underline md:text-3xl lg:text-4xl">{period.name}</h2>
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
                </div>
                <div className="col-span-1">
                    <div className="h-full w-full bg-black/10"></div>
                </div>
            </section>
        </PublicLayout>
    );
}
