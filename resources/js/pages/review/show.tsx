import MobileDetailBar from '@/components/public/mobile-detail-bar';
import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Mention } from '@/types/mention';
import { Review } from '@/types/review';
import { modelLabelPlural } from '@/utils/model-label';

import { Link } from '@inertiajs/react';

import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';

import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import 'keen-slider/keen-slider.min.css';

export default function Index({ review }: { review: { data: Review } }) {
    console.log(review);

    const [mentionedByType, setMentionedByType] = useState<{
        [key: string]: Mention[];
    }>(
        review.data.mentioned.reduce((acc: { [key: string]: Mention[] }, mention: Mention) => {
            const type = mention.mentioned_type || '';
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(mention);
            return acc;
        }, {}),
    );

    const [mentionersByType, setMentionersByType] = useState<{
        [key: string]: Mention[];
    }>(
        review.data.mentioners.reduce((acc: { [key: string]: Mention[] }, mention: Mention) => {
            const type = mention.mentioner_type || '';
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(mention);
            return acc;
        }, {}),
    );

    // const [isOpen, setIsOpen] = useState(false);

    return (
        <PublicLayout head="Crítica">
            {/* barra inferior para informações da crítica, apenas mobile */}
            <MobileDetailBar>
                <div className="space-y-1">
                    <div>
                        <p className="font-medium">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.id}>
                                <p className="hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    <div>
                        <p className="font-medium">Autoria</p>
                        {review.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.id}>
                                <p className="hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
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
                                <Link href={route('public.people.show', author)} key={author.id}>
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
                            <Link href={route('public.people.show', author)} key={author.id}>
                                <p className="line-clamp-1 hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {review.data.categories.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Categorias</p>
                            {review.data.categories.map((category) => (
                                <p key={category.id} className="line-clamp-1">
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* --------------------------------------------------------
                        FONTES ACESSADAS DIRETAMENTE
                     */}

                    {review.data.sources.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Fontes</p>
                            {review.data.sources.map((source) => (
                                // <Link href={route('public.sources.show', source)} key={source.id}>
                                <p className="line-clamp-1 hover:underline">{source.title}</p>
                                // </Link>
                            ))}
                        </div>
                    )}

                    {/* --------------------------------------------------------
                        EXEMPLOS DE LISTAGEM DE MENÇÕES QUE ESSA CRÍTICA FAZ
                        (junto e separadas)
                     */}

                    {/* <div className="mt-4">
                        <p className="font-semibold">Menções (junto)</p>
                        {review.data.mentioned.map((mention) => (
                            <Link href={route('public.mentions.show.mentioned', mention)} key={mention.id + 'juntas'}>
                                <p className="hover:underline">{mention.mentioned_name}</p>
                            </Link>
                        ))}
                    </div> */}

                    {review.data.mentioned.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Menções</p>
                            <div className="mt-1 space-y-3">
                                {Object.entries(mentionedByType).map(([type, mentions]) => (
                                    <div key={type} className="">
                                        <p className="font-medium">{modelLabelPlural(type)}</p>
                                        {mentions.map((mention) => (
                                            <Link href={route('public.mentions.show.mentioned', mention)} key={mention.id + 'separadas'}>
                                                <p className="line-clamp-1 hover:underline">{mention.mentioned_name}</p>
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --------------------------------------------------------
                        EXEMPLOS DE LISTAGEM DE MENÇÕES FEITAS A ESSA CRÍTICA
                        (junto e separadas)
                        (inclui fontes novamente)
                     */}

                    {/* <div className="mt-4">
                        <p className="font-semibold">Mencionada em (junto)</p>
                        {review.data.mentioners.map((mention) => (
                            <Link href={route('public.mentions.show.mentioner', mention)} key={mention.id + 'junto'}>
                                <p className="line-clamp-1 hover:underline">{mention.mentioner_name}</p>
                            </Link>
                        ))}
                    </div> */}

                    {/* <div className="mt-4">
                        <p className="font-semibold">Mencionada em</p>
                        {Object.entries(mentionersByType).map(([type, mentions]) => (
                            <div key={type} className="mb-4">
                                <p className="text-center text-sm font-semibold">{modelLabelPlural(type)}</p>
                                {mentions.map((mention) => (
                                    <Link href={route('public.mentions.show.mentioner', mention)} key={mention.id + 'separadas'}>
                                        <p className="hover:underline">{mention.mentioner_name}</p>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div> */}

                    {/* --------------------------------------------------------
                     */}
                </section>
                <section className="md:col-span-2 md:pr-6 lg:col-span-3 lg:pr-8">
                    <div>
                        <h1 className="text-3xl font-semibold">{review.data.title}</h1>
                        <div className="flex gap-1">
                            {review.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.id}>
                                    <span className="hover:underline md:text-lg">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <span className="text-sm text-slate-500">{formatDate(review.data.date)}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: review.data.content }} className="mt-3 text-lg lg:text-xl" />
                </section>
                <section className="lg:col-span-2">
                    {/* {review.data.images.length > 0 && (
                            <div className="grid grid-cols-1 gap-3">
                                {review.data.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={`${image.path ? image.path : 'https://placehold.co/1280x900'}`}
                                        alt="Review Image"
                                        className=""
                                    />
                                ))}
                            </div>
                        )} */}

                    <LightGallery speed={500} elementClassNames="grid grid-cols-1 lg:grid-cols-2 items-end gap-8 justify-items-right">
                        <img
                            src={`${review.data.primary_image ? review.data.primary_image.path : 'https://placehold.co/1280x900'}`}
                            alt="Review Image"
                            className=""
                        />
                        <img src={`https://placehold.co/900x1280`} alt="Review Image" className="" />
                        <img src={`https://placehold.co/900x1280`} alt="Review Image" className="" />
                    </LightGallery>
                </section>
            </div>

            {/* <div className="flex gap-3">
                {review.data.general_images.map((image) => (
                    <div key={image.id} className="">
                        <img src={`${image.path ? image.path : 'https://placehold.co/1280x900'}`} alt="Review Image" className="max-h-[600px]" />
                    </div>
                ))}
            </div> */}
        </PublicLayout>
    );
}
