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
import 'keen-slider/keen-slider.min.css';

export default function Index({ review }: { review: { data: Review } }) {
    return (
        <PublicLayout head="Crítica">
            {/* barra inferior para informações da crítica, apenas mobile */}
            <MobileDetailBar>
                <section className="space-y-3 divide-y *:pb-3">
                    <div>
                        <p className="font-semibold">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.uuid}>
                                <p className="line-clamp-1 hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {review.data.categories.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Categorias</p>
                            {review.data.categories.map((category) => (
                                <p key={category.uuid} className="line-clamp-1">
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    )}

                    {review.data.mentions.length > 0 && (
                        <div className="">
                            <p className="font-medium">Menções</p>
                            <div className="mt-2 flex flex-col gap-1">
                                {review.data.mentions.map((mention, index) => (
                                    <Link href={mention['route']} className="hover:underline" key={'mention' + index}>
                                        <p className="line-clamp-1">{mention['name']}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {review.data.sources.length > 0 && (
                        <div className="space-y-3">
                            <p className="font-semibold">Fontes</p>
                            {review.data.sources.map((source, index) => (
                                <div key={'source' + index}>
                                    <SourceCard source={source} className="" />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </MobileDetailBar>

            <div className="relative -mt-16 h-[25vh] w-full overflow-hidden lg:h-[50vh]">
                <img
                    src={`${review.data.primary_image ? review.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                    alt="Review Image"
                    className="fixed w-screen lg:bottom-36"
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

            <div className="relative grid gap-8 bg-white p-4 pt-8 md:grid-cols-3 md:px-8 lg:grid-cols-6 lg:gap-8 lg:divide-x lg:pt-12">
                <section className="hidden space-y-3 divide-y *:pb-3 lg:col-span-1 lg:block lg:pr-8">
                    <div>
                        <p className="font-semibold">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.uuid}>
                                <p className="line-clamp-1 hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {review.data.categories.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Categorias</p>
                            {review.data.categories.map((category) => (
                                <p key={category.uuid} className="line-clamp-1">
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    )}

                    {review.data.mentions.length > 0 && (
                        <div className="">
                            <p className="font-medium">Menções</p>
                            <div className="mt-2 flex flex-col gap-1">
                                {review.data.mentions.map((mention, index) => (
                                    <Link href={mention['route']} className="hover:underline" key={'mention' + index}>
                                        <p className="line-clamp-1">{mention['name']}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
                <section className="md:col-span-2 md:pr-6 lg:col-span-3 lg:pr-8">
                    <div>
                        <h1 className="text-3xl font-semibold">{review.data.title}</h1>
                        <div className="flex gap-1">
                            {review.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.uuid}>
                                    <span className="hover:underline md:text-lg">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <span className="text-sm text-slate-500">{formatDate(review.data.date)}</span>
                    </div>

                    <div className="divide-y">
                        <div dangerouslySetInnerHTML={{ __html: review.data.content }} className="mt-3 pb-6 text-lg lg:text-xl" />
                        <div className="pt-6">
                            {review.data.sources.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-lg font-semibold">Fontes</p>
                                    {review.data.sources.map((source, index) => (
                                        <div key={'source' + index}>
                                            <SourceCard source={source} className="text-lg" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <section className="lg:col-span-2">
                    <div className="grid grid-cols-2 items-end gap-8">
                        {review.data.images.map((image) => (
                            <ExpandableImage
                                key={image.uuid}
                                src={`${image.path ? image.path : 'https://placehold.co/900x1280'}`}
                                alt="History Article Image"
                                // className="cursor-pointer object-cover"
                            />
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
