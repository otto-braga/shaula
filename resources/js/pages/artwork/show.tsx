import MobileDetailBar from '@/components/public/mobile-detail-bar';
import { SourceCard } from '@/components/ui/source-card';
import PublicLayout from '@/layouts/public-layout';
import { formatDate } from '@/lib/utils';
import { Artwork } from '@/types/artwork';
import { Link } from '@inertiajs/react';
import 'keen-slider/keen-slider.min.css';

export default function Show({ artwork }: { artwork: { data: Artwork } }) {
    console.log(artwork);
    // const { data } = artwork;

    return (
        <PublicLayout head="Obra">
            <div className="relative grid gap-8 bg-white p-4 pt-8 md:grid-cols-3 md:px-8 lg:grid-cols-6 lg:gap-8 lg:divide-x lg:pt-12">
                <MobileDetailBar>
                    <div className="space-y-2">
                        <div>
                            <p className="font-semibold">Autoria</p>
                            {artwork.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.uuid}>
                                    <p className="line-clamp-1 hover:underline">{author.name}</p>
                                </Link>
                            ))}
                        </div>

                        {artwork.data.categories.length > 0 && (
                            <div className="">
                                <p className="font-semibold">Categorias</p>
                                {artwork.data.categories.map((category) => (
                                    <p key={category.uuid} className="line-clamp-1">
                                        {category.name}
                                    </p>
                                ))}
                            </div>
                        )}
                        {artwork.data.periods.length > 0 && (
                            <div className="">
                                <p className="font-semibold">Períodos</p>
                                {artwork.data.periods.map((period) => (
                                    <Link href={route('public.periods.show', period)} key={period.uuid}>
                                        <p className="line-clamp-1">{period.name}</p>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {artwork.data.mentions.length > 0 && (
                            <div className="">
                                <p className="font-semibold">Menções</p>
                                <div className="mt-2 space-y-3">
                                    {artwork.data.mentions.map((mention, index) => (
                                        <div key={'mention' + index}>
                                            <p>
                                                <Link href={mention['route']} className="hover:underline">
                                                    {mention['name']}
                                                </Link>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {artwork.data.sources.length > 0 && (
                            <div>
                                <p className="font-semibold">Fontes</p>
                                {artwork.data.sources.map((source, index) => (
                                    <div key={'source' + index}>
                                        <SourceCard source={source} className="line-clamp-1" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </MobileDetailBar>

                {/* Info */}
                <section className="hidden space-y-3 divide-y *:pb-3 lg:col-span-1 lg:block lg:pr-8">
                    <div>
                        <p className="font-semibold">Autoria</p>
                        {artwork.data.authors.map((author) => (
                            <Link href={route('public.people.show', author)} key={author.uuid}>
                                <p className="line-clamp-1 hover:underline">{author.name}</p>
                            </Link>
                        ))}
                    </div>
                    {artwork.data.categories.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Categorias</p>
                            {artwork.data.categories.map((category) => (
                                <p key={category.uuid} className="line-clamp-1">
                                    {category.name}
                                </p>
                            ))}
                        </div>
                    )}

                    {artwork.data.periods.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Períodos</p>
                            {artwork.data.periods.map((period) => (
                                <Link href={route('public.periods.show', period)} key={period.uuid}>
                                    <p className="line-clamp-1">{period.name}</p>
                                </Link>
                            ))}
                        </div>
                    )}

                    {artwork.data.mentions.length > 0 && (
                        <div className="">
                            <p className="font-semibold">Menções</p>
                            <div className="mt-2 space-y-3">
                                {artwork.data.mentions.map((mention, index) => (
                                    <div key={'mention' + index}>
                                        <p>
                                            <Link href={mention['route']} className="hover:underline">
                                                {mention['name']}
                                            </Link>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {artwork.data.sources.length > 0 && (
                        <div>
                            <p className="font-semibold">Fontes</p>
                            {artwork.data.sources.map((source, index) => (
                                <div key={'source' + index}>
                                    <SourceCard source={source} className="line-clamp-1" />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Pics */}
                <section className="space-y-6 md:col-span-2 md:pr-6 lg:col-span-3 lg:pr-8">
                    {artwork.data.images.map((image) => (
                        <img src={image.path} className="w-full" />
                    ))}
                </section>

                {/* content  */}
                <section className="lg:col-span-2">
                    <div className="text-center">
                        <h1 className="text-2xl font-medium">{artwork.data.title}</h1>
                        <div className="space-x-3">
                            {artwork.data.authors.map((author) => (
                                <Link href={route('public.people.show', author)} key={author.uuid}>
                                    <span className="underline">{author.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: artwork.data.content }} className="mt-6 text-lg" />
                </section>
            </div>
        </PublicLayout>
    );
}
