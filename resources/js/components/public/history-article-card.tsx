import { HistoryArticle } from '@/types/historyArticle';
import { Link } from '@inertiajs/react';

interface HistoryArticleCardProps {
    article: HistoryArticle;
}

export function HistoryArticleCard({ article }: HistoryArticleCardProps) {
    const imageSrc =
        article.primary_image?.path ||
        (article.images && article.images.length > 0 ? article.images[0].path : 'https://placehold.co/1200x900?text=Artigo');

    return (
        <Link href={route('public.history_articles.show', { historyArticle: article.slug })} className="group flex h-full w-full max-w-full min-w-0 flex-col overflow-hidden">
            <div className="w-full max-w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                <img
                    src={imageSrc}
                    alt={article.title}
                    className="aspect-video w-full max-w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="mt-3 flex w-full min-w-0 flex-1 flex-col break-words">
                <h3 className="text-center text-2xl font-semibold break-words group-hover:underline dark:text-gray-100">
                    {article.title}
                </h3>
                {article.authors && article.authors.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-center gap-x-1 text-center break-words">
                        {article.authors.map((author) => (
                            <span key={author.uuid} className="break-words text-gray-500 dark:text-gray-400">
                                {author.name}
                            </span>
                        ))}
                    </div>
                )}
                {article.content && (
                    <div
                        dangerouslySetInnerHTML={{ __html: article.content }}
                        className="mt-3 line-clamp-5 w-full max-w-full min-w-0 overflow-hidden break-words text-gray-600 no-underline [overflow-wrap:anywhere] [&_img]:hidden dark:text-gray-300"
                    />
                )}
            </div>
        </Link>
    );
}

export default HistoryArticleCard;
