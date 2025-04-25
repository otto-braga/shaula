import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Person, personLabel } from '@/types/person';
import { Review } from '@/types/review';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import Tabs from './tabs';
import { Artwork } from '@/types/artwork';
import { Mention, MentionsByType, MentionsQuery } from '@/types/mention';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: route('review.index'),
    },
];

export default function Mentions({
    review,
    mentions_queries,
    mentions_by_type,
}: {
    review: { data: Review };
    mentions_queries: { data: MentionsQuery[] };
    mentions_by_type: { data: MentionsByType[] };
    people: { data: Person[] };
    artworks: { data: Artwork[] };
}) {
    const { data, setData, post, errors, processing } = useForm({
        mentions_by_type: [] as MentionsByType[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('review.update.mentions', review.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [selectedMentionsByType, setSelectedMentionsByType] = useState<MentionsByType[]>(
        mentions_by_type.data.map((mention_type) => ({
            type: mention_type.type,
            type_label: mention_type.type_label,
            mentions: mention_type.mentions.map((mention) => ({
                id: mention.id,
                mentioner_id: mention.mentioner_id,
                mentioner_type: mention.mentioner_type,
                mentioner_name: mention.mentioner_name,
                mentioned_id: mention.mentioned_id,
                mentioned_type: mention.mentioned_type,
                mentioned_name: mention.mentioned_name,
                created_at: mention.created_at,
                updated_at: mention.updated_at,
            })),
        })),
    );

    useEffect(() => {
        setData('mentions_by_type', selectedMentionsByType);
    }, [selectedMentionsByType]);

    // Example: async fetch mention's mentioned using mention's id.
    const fetchMentioned = async () => {
        let response;

        fetch(route('mentions.fetch.mentioned', { id: selectedMentionsByType[0].mentions[0].id }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data', data);
                response = data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs review={review} processing={processing} />

                            {/* <Button
                                type="button"
                                variant="secondary"
                                className="mt-4"
                                onClick={() => fetchMentioned()}
                            >
                                Teste
                            </Button> */}

                            {
                                mentions_queries.data.map((mentions_query) => {
                                    return (
                                        <div key={mentions_query.type_label} className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {mentions_query.type_label}
                                            </label>
                                            <Select
                                                id={mentions_query.type_label}
                                                isMulti
                                                isClearable
                                                options={
                                                    mentions_query.query.map((instance) => ({
                                                        value: instance.id,
                                                        label: instance.name,
                                                    }))
                                                }
                                                defaultValue={
                                                    selectedMentionsByType.filter(
                                                        (selectedMentionType) => selectedMentionType.type === mentions_query.type
                                                    )[0].mentions.map((mention) => ({
                                                        value: mention.mentioned_id,
                                                        label: mention.mentioned_name,
                                                    }))
                                                }
                                                onChange={
                                                    (selectedOptions) => {
                                                        const currentSelectedMentionsByType = {
                                                            type: mentions_query.type,
                                                            type_label: mentions_query.type_label,
                                                            mentions: selectedOptions.map((option) => ({
                                                                mentioned_id: option.value,
                                                                mentioned_type: mentions_query.type,
                                                            } as Mention)),
                                                        } as MentionsByType;

                                                        setSelectedMentionsByType((prev) => {
                                                            const existingMentionTypes = prev.filter(
                                                                (mentionType) => mentionType.type !== mentions_query.type
                                                            );
                                                            return [...existingMentionTypes, currentSelectedMentionsByType];
                                                        });
                                                    }
                                                }
                                                styles={handleReactSelectStyling()}
                                            ></Select>
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
