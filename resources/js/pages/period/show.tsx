import PublicLayout from '@/layouts/public-layout';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import { Period } from '@/types/period';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowRight } from 'lucide-react';

export default function Index({ period }: { period: { data: Period } }) {
    console.log(period.data);
    return (
        <PublicLayout head={period.data.name}>
            <div>
                <div className="max-h-[40vh] overflow-hidden">
                    <img
                        src={`${period.data.primary_image ? period.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                        alt="Review Image"
                        className="w-full"
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 divide-x p-4 md:grid-cols-2 md:p-8">
                    <div className="md:pr-6">
                        <h1 className="text-4xl font-bold">{period.data.name}</h1>
                        <div className="mt-3 flex gap-2 text-2xl">
                            <span>{period.data.start_date}</span>
                            <ArrowRight />
                            <span>{period.data.end_date}</span>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: period.data.content }} className="mt-8 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl">Artigos relacionados</h2>
                        <div className="mt-6">
                            {period.data.history_articles.length > 0 ? (
                                period.data.history_articles?.map((article) => {
                                    return (
                                        <Link href={route('public.history_articles.show', { historyArticle: article })}>
                                            <div className="group flex gap-6">
                                                <img
                                                    src={`${article.primary_image ? article.primary_image.path : 'https://placehold.co/1280x900'}`}
                                                    alt="Review Image"
                                                    className="aspect-square w-40 object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-xl font-medium group-hover:underline">{article.title}</h3>
                                                    <div className="flex gap-3 text-slate-700 *:underline">
                                                        {article.authors.map((author) => {
                                                            return <span>{author.name}</span>;
                                                        })}
                                                    </div>
                                                    <div dangerouslySetInnerHTML={{ __html: article.content }} className="mt-3 line-clamp-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="text-slate-400 italic">Nenhum artigo relacionado até o momento.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
