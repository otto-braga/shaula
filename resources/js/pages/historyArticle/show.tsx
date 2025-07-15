import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { HistoryArticle } from '@/types/historyArticle';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import ExpandableImage from '@/components/expandable-image';
import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { SourceCard } from '@/components/ui/source-card';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';

export default function Show({ historyArticle }: { historyArticle: { data: HistoryArticle } }) {
    console.log(historyArticle.data);
    return (
        <PublicLayout head="História">
            {/* barra inferior para informações do artigo, apenas mobile */}
            <MobileDetailBar>
                <div className="space-y-3 divide-y *:pb-3">
                    <div className="pb-3 md:pr-6 md:pb-6">
                        <h3 className="">Período</h3>
                        {historyArticle.data.periods.map((period) => (
                            <p className="text-xl font-medium">{period.name}</p>
                        ))}
                    </div>
                    <div>
                        <p className="mb-2 font-medium">Autoria</p>
                        {historyArticle.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.uuid}>
                                <p className="hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {historyArticle.data.categories.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 font-medium">Categorias</p>
                            {historyArticle.data.categories.map((category) => (
                                <p>{category.name}</p>
                            ))}
                        </div>
                    )}
                    <div className="">
                        <p className="font-medium">Menções</p>
                        <div className="mt-2 flex flex-col gap-1">
                            {historyArticle.data.mentions.map((mention, index) => (
                                <Link href={mention['route']} className="hover:underline" key={'mention' + index}>
                                    <p className="line-clamp-1">{mention['name']}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {historyArticle.data.sources.length > 0 && (
                        <div className="space-y-2">
                            <p className="font-semibold">Fontes</p>
                            {historyArticle.data.sources.map((source, index) => (
                                <div key={'source' + index}>
                                    <SourceCard source={source} className="line-clamp-1" />
                                </div>
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
                <section className="hidden md:col-span-2 md:space-y-3 md:divide-y lg:block lg:pr-12">
                    <div className="space-y-3 divide-y *:pb-3">
                        <div className="md:pr-6">
                            <h3 className="">Períodos</h3>
                            {historyArticle.data.periods.map((period) => (
                                <Link href={route('public.periods.show', period)}>
                                    <p className="text-xl font-medium">{period.name}</p>
                                </Link>
                            ))}
                        </div>
                        <div>
                            <p className="mb-2 font-medium">Autoria</p>
                            {historyArticle.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.uuid}>
                                    <p className="hover:underline">{author.name}</p>
                                </Link>
                            ))}
                        </div>
                        {historyArticle.data.categories.length > 0 && (
                            <div className="mt-4">
                                <p className="mb-2 font-medium">Categorias</p>
                                {historyArticle.data.categories.map((category) => (
                                    <p>{category.name}</p>
                                ))}
                            </div>
                        )}
                        <div className="">
                            <p className="font-medium">Menções</p>
                            <div className="mt-2 flex flex-col gap-1">
                                {historyArticle.data.mentions.map((mention, index) => (
                                    <Link href={mention['route']} className="hover:underline" key={'mention' + index}>
                                        <p className="line-clamp-1">{mention['name']}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {historyArticle.data.sources.length > 0 && (
                            <div className="space-y-2">
                                <p className="font-semibold">Fontes</p>
                                {historyArticle.data.sources.map((source, index) => (
                                    <div key={'source' + index}>
                                        <SourceCard source={source} className="line-clamp-1" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* conteúdo do artigo */}
                <section className="col-span-6 space-y-8 divide-y *:pb-8 lg:col-span-4 lg:pr-12">
                    <div className="">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-medium md:text-3xl">{historyArticle.data.title}</h1>
                            <div className="">
                                {historyArticle.data.authors.map((author, index) => (
                                    <span key={author.uuid}>
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
                    <div>
                        {/* <Gallery images={historyArticle.data.images} columns={2} /> */}
                        <div className="grid grid-cols-2 gap-4">
                            {(() => {
                                const columns = historyArticle.data.images.reduce(
                                    (acc, image, index) => {
                                        acc[index % 2].push(
                                            <ExpandableImage
                                                key={image.uuid}
                                                src={`${image.path ? image.path : 'https://placehold.co/900x1280'}`}
                                                alt="History Article Image"
                                                className="w-full cursor-pointer object-cover"
                                            />,
                                        );
                                        return acc;
                                    },
                                    [[], []] as JSX.Element[][],
                                );

                                return columns.map((column, columnIndex) => (
                                    <div key={columnIndex} className="flex flex-col gap-4">
                                        {column}
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </section>

                {/* galeria de imagens */}
            </main>
        </PublicLayout>
    );
}
