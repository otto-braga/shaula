import PublicLayout from '@/layouts/public-layout';
import { Work } from '@/types/work';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowUpRight } from 'lucide-react';

export default function Index({ reviews, artworks }: { reviews: { data: Work[] }; artworks: { data: Work[] } }) {
    return (
        <PublicLayout head="SHAULA">
            <section className="px-4 py-8 md:p-8">
                <Link href="/critica" className="inline-block">
                    <span className="flex items-center hover:underline">
                        <h2 className="text-3xl">ÚLTIMAS CRÍTICAS</h2>
                        <ArrowUpRight size={32} />
                    </span>
                </Link>
                <div className="mt-6 flex w-full flex-col items-start md:flex-row md:gap-8 lg:gap-12">
                    {reviews.data.map((review) => (
                        <div key={review.id} className="">
                            <div className="bg-pink-100">
                                <img
                                    src={`${review.images[0] ? review.images[1].path : 'https://placehold.co/1200x900'}`}
                                    alt="Review Image"
                                    className="w-full object-cover"
                                />
                            </div>
                            <div className="mt-3">
                                <h2 className="text-center text-2xl font-semibold">{review.title}</h2>
                                <div className="space-x-1 text-center">
                                    {review.authors.map((author) => (
                                        <span key={author.id} className="text-gray-500 underline">
                                            {author.name}
                                        </span>
                                    ))}
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: review.content }} className="mt-3 line-clamp-5 no-underline" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
