import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Artwork } from '@/types/artwork';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import Tabs from './tabs';
import { Mention, MentionQuery } from '@/types/mention';
import { modelLabel } from '@/utils/model-label';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obras',
        href: route('artworks.index'),
    },
];

export default function Mentions({
    artwork,
    mention_queries,
}: {
    artwork: { data: Artwork };
        mention_queries: { data: MentionQuery[] };
}) {
    const { data, setData, post, errors, processing } = useForm({
        mentions: artwork.data.mentioned as Mention[],
    });

    useEffect(() => {
        console.log('data', data);
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('artworks.update.mentions', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} />

                            {
                                artwork.data.mentioned.map((mention) => {
                                    return (
                                        <div key={mention.id} className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <Link
                                                    href={route('mentions.show.mentioned', { mention: mention })}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    {mention.mentioned_name}
                                                </Link>
                                            </label>
                                        </div>
                                    );
                                })
                            }

                            {
                                mention_queries.data.map((mention_query) => {
                                    return (
                                        <div key={mention_query.type} className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {modelLabel(mention_query.type)}
                                            </label>
                                            <LazyLoadingMultiSelect
                                                initialOptions={
                                                    artwork.data.mentioned?.filter(
                                                        (mentioned) => mentioned.mentioned_type === mention_query.type
                                                    ).map((mention) => ({
                                                        value: mention.mentioned_id ?? 0,
                                                        label: mention.mentioned_name ?? '',
                                                    })) ?? []
                                                }
                                                routeName={
                                                    'mentions.fetch.options'
                                                }
                                                type={
                                                    mention_query.type
                                                }
                                                setterFunction={
                                                    (options) => {
                                                        const selectedMentions = options.map((option) => ({
                                                            mentioned_id: option.value,
                                                            mentioned_type: mention_query.type,
                                                        }));

                                                        setData('mentions', [
                                                            ...data.mentions.filter(
                                                                (mention) => mention.mentioned_type !== mention_query.type
                                                            ),
                                                            ...selectedMentions,
                                                        ]);
                                                    }
                                                }
                                            />
                                        </div>
                                    );
                                })
                            }

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
