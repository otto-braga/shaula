import PublicLayout from '@/layouts/public-layout';
import { Artwork } from '@/types/artwork';
import { Review } from '@/types/review';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowUpRight } from 'lucide-react';

export default function Index({ reviews, artworks }: { reviews: { data: Review[] }; artworks: { data: Artwork[] } }) {
    return (
        <PublicLayout head="SHAULA">
            <section className="px-4 py-8 md:p-8">
                <Link href="/critica" className="inline-block">
                    <span className="flex items-center hover:underline">
                        <h2 className="text-red text-3xl">ÚLTIMAS CRÍTICAS -TESTE 4</h2>
                        <h2 className="text-red-600">teste com ECR</h2>
                        <ArrowUpRight size={32} />
                    </span>
                </Link>
                <div className="mt-6 grid w-full gap-8 md:grid-cols-3">
                    {reviews.data.map((review) => (
                        <Link href={route('public.reviews.show', review)} key={review.uuid} className="group">
                            <div key={review.uuid} className="">
                                <div className="bg-pink-100">
                                    <img
                                        src={`${review.primary_image ? review.primary_image.path : 'https://placehold.co/1200x900'}`}
                                        alt="Review Image"
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-center text-2xl font-semibold group-hover:underline">{review.title}</h2>
                                    <div className="space-x-1 text-center">
                                        {review.authors.map((author) => (
                                            <span key={author.uuid} className="text-gray-500">
                                                {author.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: review.content }} className="mt-3 line-clamp-5 no-underline" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
