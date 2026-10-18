import MobileDetailBar from '@/components/public/mobile-detail-bar';
import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Review } from '@/types/review';

import { Link } from '@inertiajs/react';

import 'keen-slider/keen-slider.min.css';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import ExpandableImage from '@/components/expandable-image';
import { SourceCard } from '@/components/ui/source-card';
import './TinyMCEContent.css';

export default function Index({ review }: { review: { data: Review } }) {
    return (
        <PublicLayout head="Crítica">
            {/* barra inferior para informações da crítica, apenas mobile */}
            <MobileDetailBar>
                <section className="w-full max-w-full min-w-0 space-y-3 divide-y overflow-hidden break-words *:pb-3">
                    <div className="min-w-0">
                        <p className="font-semibold">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.uuid}>
                                <p className="line-clamp-1 break-words hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {review.data.categories.length > 0 && (
                        <div className="min-w-0">
                            <p className="font-semibold">Categorias</p>
                            {review.data.categories.map((category) => (
                                <p key={category.uuid} className="line-clamp-1 break-words">
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    )}
                    {review.data.sources.length > 0 && (
                        <div className="min-w-0 space-y-3 break-words">
                            <p className="font-semibold">Fontes</p>
                            {review.data.sources.map((source, index) => (
                                <div key={'source' + index} className="w-full max-w-full min-w-0 overflow-hidden break-words">
                                    <SourceCard source={source} className="break-words" />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </MobileDetailBar>

            <div className="relative -mt-16 h-[35vh] w-full max-w-full overflow-hidden [clip-path:inset(0)] sm:h-[45vh] lg:h-[60vh]">
                <img
                    src={`${review.data.primary_image ? review.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                    alt="Review Image"
                    className="fixed inset-x-0 top-0 mx-auto h-[35vh] w-full max-w-full object-cover object-center sm:h-[45vh] lg:h-[60vh]"
                />
                {/* <div className="via-zinc-70 absolute bottom-1/4 left-1/2 z-20 flex justify-center bg-gradient-to-r from-zinc-900/20 via-zinc-400/50 to-zinc-900/40 p-1 backdrop-blur-lg">
                    <div>
                        <h1 className="font-semibold text-white md:text-3xl">{review.data.title}</h1>
                        <div className="flex gap-1">
                            {review.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.uuid}>
                                    <span className="text-gray-100 hover:underline md:text-lg">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div> */}
            </div>

            <div className="relative grid w-full max-w-full min-w-0 grid-cols-1 gap-8 overflow-hidden bg-white p-4 pt-8 md:grid-cols-3 md:px-8 lg:grid-cols-6 lg:gap-8 lg:divide-x lg:pt-12 dark:bg-zinc-950">
                <section className="hidden min-w-0 space-y-3 divide-y *:pb-3 lg:col-span-1 lg:block lg:pr-8">
                    <div className="min-w-0">
                        <p className="font-semibold">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.uuid}>
                                <p className="line-clamp-1 break-words hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {review.data.categories.length > 0 && (
                        <div className="min-w-0">
                            <p className="font-semibold">Categorias</p>
                            {review.data.categories.map((category) => (
                                <p key={category.uuid} className="line-clamp-1 break-words">
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    )}
                </section>
                <section className="w-full max-w-full min-w-0 overflow-hidden md:col-span-2 md:pr-6 lg:col-span-3 lg:pr-8">
                    <div className="w-full max-w-full min-w-0 break-words">
                        <h1 className="text-3xl font-semibold break-words">{review.data.title}</h1>
                        <div className="flex flex-wrap gap-1 break-words">
                            {review.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.uuid}>
                                    <span className="break-words hover:underline md:text-lg">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <span className="text-sm text-slate-500">{formatDate(review.data.date)}</span>
                    </div>

                    <div className="w-full max-w-full min-w-0 divide-y overflow-hidden">
                        <div
                            dangerouslySetInnerHTML={{ __html: review.data.content }}
                            className="tinymce-content prose mt-3 w-full max-w-full min-w-0 overflow-hidden pb-6 text-lg break-words [overflow-wrap:break-word] [&_iframe]:h-auto [&_iframe]:max-w-full [&_img]:h-auto [&_img]:max-w-full [&_pre]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_table]:block [&_table]:h-auto [&_table]:max-w-full [&_table]:overflow-x-auto [&_video]:h-auto [&_video]:max-w-full lg:text-xl"
                        />
                        <div className="w-full max-w-full min-w-0 overflow-hidden pt-6 break-words">
                            {review.data.sources.length > 0 && (
                                <div className="w-full max-w-full min-w-0 space-y-3 break-words">
                                    <p className="text-lg font-semibold">Fontes</p>
                                    {review.data.sources.map((source, index) => (
                                        <div key={'source' + index} className="w-full max-w-full min-w-0 overflow-hidden break-words">
                                            <SourceCard source={source} className="text-lg break-words" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <section className="w-full max-w-full min-w-0 overflow-hidden lg:col-span-2">
                    <div className="grid w-full max-w-full min-w-0 grid-cols-2 items-end gap-4 sm:gap-8">
                        {review.data.images.map((image) => (
                            <div key={image.uuid} className="w-full max-w-full min-w-0 overflow-hidden">
                                <ExpandableImage
                                    src={`${image.path ? image.path : 'https://placehold.co/900x1280'}`}
                                    alt="History Article Image"
                                    // className="cursor-pointer object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* <div className="flex gap-3">
                {review.data.general_images.map((image) => (
                    <div key={image.uuid} className="">
                        <img src={`${image.path ? image.path : 'https://placehold.co/1280x900'}`} alt="Review Image" className="max-h-[600px]" />
                    </div>
                ))}
            </div> */}
        </PublicLayout>
    );
}
