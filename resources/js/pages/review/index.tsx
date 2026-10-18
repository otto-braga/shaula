import PaginationWithAnchor from '@/components/PaginationWithAnchor';
import FeaturedCarousel from '@/components/public/featured-carousel';
import PublicLayout from '@/layouts/public-layout';
import { Category } from '@/types/category';
import { PaginatedData } from '@/types/paginated-data';
import { Review } from '@/types/review';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';

export default function Index({
    reviews,
    categories,
    totalCategoriesCount,
    filters,
    lastReviews,
    carouselReviews,
}: {
    reviews: PaginatedData<Review>;
    categories: { data: Category[] };
    totalCategoriesCount: number;
    filters?: {
        category?: string | null;
        search?: string | null;
        cat_limit?: number | string | null;
    };
    lastReviews?: { data: Review[] };
    carouselReviews?: { data: Review[] };
}) {
    const currentLimit = filters?.cat_limit ? Number(filters.cat_limit) : 10;
    const nextLimit = currentLimit + 10;

    return (
        <PublicLayout head="Crítica">
            <FeaturedCarousel
                items={carouselReviews?.data ?? lastReviews?.data ?? []}
                getHref={(review) => route('public.reviews.show', { review: review.slug })}
            />

            <section className="grid w-full max-w-full grid-cols-1 md:divide-x overflow-hidden px-4 pt-8 md:grid-cols-8 md:gap-8 md:px-8">
                <div className="mb-6 w-full max-w-full min-w-0 md:col-span-2 md:mb-0 md:pr-8">
                    <div className="mt-3 w-full max-w-full min-w-0 space-y-6 break-words">
                        <h1 className="font-medium break-words">SHAULA - CRÍTICA</h1>
                        <p className="max-w-sm text-justify break-words">
                            Esta seção busca divulgar os textos produzidos pelos estudantes da disciplina de Crítica de Arte do curso de Artes Visuais
                            da UFRN, bem como publicar textos escritos por colaboradores convidados. Assim, objetiva-se a promoção do debate crítico
                            sobre a arte contemporânea e as práticas curatoriais mais recentes. O ponto de vista adotado é a crítica de arte dedicada
                            às artes visuais no RN e a partir do Nordeste.
                        </p>
                    </div>
                </div>
                <div id="criticas" className="w-full max-w-full min-w-0 divide-y overflow-hidden md:col-span-4 md:pr-8 lg:col-span-5">
                    {reviews.data.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            <p className="text-lg">Nenhuma crítica encontrada para esta categoria.</p>
                            <Link href={route('public.reviews.index')} className="mt-2 inline-block text-sm font-medium text-black underline">
                                Limpar filtro
                            </Link>
                        </div>
                    ) : (
                        reviews.data.map((review) => (
                            <Link href={route('public.reviews.show', review)} key={review.uuid} className="block w-full max-w-full min-w-0">
                                <div className="grid w-full max-w-full min-w-0 grid-cols-1 gap-3 space-y-3 py-6 md:grid-cols-2">
                                    <div className="w-full max-w-full min-w-0 overflow-hidden">
                                        <img
                                            src={`${review.images.length > 0 ? review.images[0].path : 'https://placehold.co/1280x900'}`}
                                            alt="Review Image"
                                            className="aspect-video w-full max-w-full object-cover"
                                        />
                                    </div>
                                    <div className="w-full max-w-full min-w-0 overflow-hidden break-words">
                                        <h2 className="text-2xl font-semibold break-words">{review.title}</h2>
                                        <div className="flex flex-wrap gap-x-1 break-words">
                                            {review.authors.map((author) => (
                                                <span key={author.uuid} className="break-words text-gray-500 underline">
                                                    {author.name}
                                                </span>
                                            ))}
                                        </div>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: review.content }}
                                            className="mt-3 line-clamp-5 w-full max-w-full min-w-0 overflow-hidden text-lg break-words text-gray-600 [overflow-wrap:anywhere] [&_img]:hidden"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                    <PaginationWithAnchor links={reviews.meta.links} anchor="#criticas" />
                </div>
                <div className="mt-8 w-full max-w-full min-w-0 md:col-span-2 md:mt-0 md:pl-4 lg:col-span-1">
                    <div className="w-full max-w-full min-w-0 space-y-4 pt-3 break-words">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <h2 className="font-medium">Categorias</h2>
                            {filters?.category && (
                                <Link
                                    href={route('public.reviews.index', {
                                        ...(filters?.cat_limit ? { cat_limit: filters.cat_limit } : {}),
                                    })}
                                    preserveScroll
                                    preserveState
                                    className="text-xs text-gray-500 hover:text-black hover:underline"
                                >
                                    Limpar
                                </Link>
                            )}
                        </div>
                        <ul className="space-y-2">
                            {filters?.category && (
                                <li>
                                    <Link
                                        href={route('public.reviews.index', {
                                            ...(filters?.cat_limit ? { cat_limit: filters.cat_limit } : {}),
                                        })}
                                        preserveScroll
                                        preserveState
                                        className="block text-sm text-gray-500 transition-colors hover:text-black hover:underline"
                                    >
                                        Limpar
                                    </Link>
                                </li>
                            )}
                            {categories?.data?.map((cat) => {
                                const isActive = filters?.category === cat.slug;
                                return (
                                    <li key={cat.uuid} className="min-w-0 break-words">
                                        <Link
                                            href={route('public.reviews.index', {
                                                category: cat.slug,
                                                ...(filters?.cat_limit ? { cat_limit: filters.cat_limit } : {}),
                                            })}
                                            preserveScroll
                                            preserveState
                                            className={`block text-sm break-words transition-colors hover:underline ${
                                                isActive ? 'font-bold text-black underline underline-offset-4' : 'text-gray-600 hover:text-black'
                                            }`}
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        {categories?.data && categories.data.length < totalCategoriesCount && (
                            <div className="pt-2">
                                <Link
                                    href={route('public.reviews.index', {
                                        ...(filters?.category ? { category: filters.category } : {}),
                                        cat_limit: nextLimit,
                                    })}
                                    preserveScroll
                                    preserveState
                                    className="inline-block cursor-pointer text-xs font-medium text-gray-500 hover:text-black hover:underline"
                                >
                                    Ver mais
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
