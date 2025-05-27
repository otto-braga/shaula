import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { HistoryArticle } from '@/types/historyArticle';

import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';
import { ArrowUpRight } from 'lucide-react';

export default function Show({ historyArticle }: { historyArticle: { data: HistoryArticle } }) {
    console.log(historyArticle.data);
    return (
        <PublicLayout head="História">
            {/* barra inferior para informações do artigo, apenas mobile */}
            <MobileDetailBar>
                <div className="pb-3 md:pr-6 md:pb-6">
                    <h3 className="">Período</h3>
                    <p className="text-xl font-medium">{historyArticle.data.periods[0].name}</p>
                    <div dangerouslySetInnerHTML={{ __html: historyArticle.data.periods[0].content }} className="mt-4 line-clamp-5 text-slate-500" />
                    <div className="mt-6 flex justify-end">
                        <Link href="#">
                            <div className="flex items-center gap-1 text-lg hover:underline">
                                <span>Ver mais</span>
                                <ArrowUpRight />
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="space-y-3 border-t pt-3 text-lg">
                    <div>
                        <p className="font-medium">Autoria</p>
                        {historyArticle.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.id}>
                                <p className="hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>

                    {historyArticle.data.categories.length > 0 && (
                        <div className="mt-4">
                            <p className="font-medium">Categorias</p>
                            {historyArticle.data.categories.map((category) => (
                                <p>{category.name}</p>
                            ))}
                        </div>
                    )}
                </div>
            </MobileDetailBar>

            {/* A GRID AQUI SERÁ 3(OU 4) PRO CONTENT E 2 PRA GALERIA
            NO CONTENT PRIMEIRO TERÁ TITULO E SOBRE O PERIODO DO ARTIGO
            DEPOIS O TITULO, AUTORES E CONTEUDO DO ARTIGO
            NAO SEI SE 'CATEGORIAS' SE APLICA */}

            <main className="grid gap-12 p-4 pt-8 pb-20 md:grid-cols-6 md:divide-x-1 md:px-8">
                {/* infomações sobre o artigo */}
                <section className="hidden md:col-span-2 md:space-y-6 md:divide-y lg:block lg:pr-12">
                    <div className="md:pr-6 md:pb-6">
                        <h3 className="">Período</h3>
                        <p className="text-xl font-medium">{historyArticle.data.periods[0].name}</p>
                        <div
                            dangerouslySetInnerHTML={{ __html: historyArticle.data.periods[0].content }}
                            className="mt-4 line-clamp-5 text-slate-500"
                        />
                        <div className="mt-6 flex justify-end">
                            <Link href="#">
                                <div className="flex items-center gap-1 hover:underline">
                                    <span>Ver mais</span>
                                    <ArrowUpRight />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-3 md:sticky md:top-24">
                        <div>
                            <p className="font-medium">Autoria</p>
                            {historyArticle.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.id}>
                                    <p className="hover:underline">{author.name}</p>
                                </Link>
                            ))}
                        </div>

                        {historyArticle.data.categories.length > 0 && (
                            <div className="mt-4">
                                <p className="font-medium">Categorias</p>
                                {historyArticle.data.categories.map((category) => (
                                    <p>{category.name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* conteúdo do artigo */}
                <section className="col-span-6 lg:col-span-4 lg:pr-12">
                    <div className="">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-medium md:text-3xl">{historyArticle.data.title}</h1>
                            <div className="">
                                {historyArticle.data.authors.map((author, index) => (
                                    <span key={author.id}>
                                        <Link href={route('public.people.show', author)}>
                                            <p className="inline hover:underline">{author.name}</p>
                                        </Link>
                                        {index < historyArticle.data.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {historyArticle.data.primary_image && (
                            <div className="flex h-64 w-full">
                                <img src={historyArticle.data.primary_image.path} alt="Review Image" className="w-full object-cover object-center" />
                            </div>
                        )}
                        <p className="mt-8 mb-4 text-sm text-slate-500">{formatDate(historyArticle.data.date)}</p>
                        <div dangerouslySetInnerHTML={{ __html: historyArticle.data.content }} className="text-lg md:text-2xl" />
                    </div>
                    <section className="mt-12 border-t pt-12">
                        <LightGallery speed={500} elementClassNames="grid items-end md:grid-cols-1 md:grid-cols-2 gap-8 ">
                            {historyArticle.data.images.map((image) => (
                                <img
                                    src={`${image.path ? image.path : 'https://placehold.co/900x1280'}`}
                                    alt="Review Image"
                                    className="w-full cursor-pointer object-cover"
                                />
                            ))}
                        </LightGallery>
                    </section>
                </section>

                {/* galeria de imagens */}
            </main>
        </PublicLayout>
    );
}
