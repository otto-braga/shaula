import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Person, personLabel } from '@/types/person';
import { Review } from '@/types/review';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import Tabs from './tabs';
import { Artwork } from '@/types/artwork';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: route('review.index'),
    },
];

export default function People({
    review,
    people,
    artworks,
}: {
    review: { data: Review };
    people: { data: Person[] };
    artworks: { data: Artwork[] };
}) {
    const { data, setData, post, errors, processing } = useForm({
        people: review.data.mentioned_people ? review.data.mentioned_people : [],
        artworks: review.data.mentioned_artworks ? review.data.mentioned_artworks : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('review.update.mentions', review.data), {
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
                            <Tabs review={review} processing={processing} />
                                <Select
                                    id="people"
                                    isMulti
                                    options={
                                        people?.data.map((person) => ({
                                            value: person.id,
                                            label: personLabel(person),
                                        })) || []
                                    }
                                    value={
                                        data.people.map((person) => ({
                                            value: person.id,
                                            label: personLabel(person),
                                        })) || []
                                    }
                                    onChange={(selectedOptions => {
                                        setData('people', people?.data.filter((person) =>
                                            selectedOptions.some((option) => option.value === person.id)
                                        ));
                                    })}
                                    styles={handleReactSelectStyling()}
                                />

                                <Select
                                    id="artworks"
                                    isMulti
                                    options={
                                        artworks?.data.map((artwork) => ({
                                            value: artwork.id,
                                            label: artwork.title,
                                        })) || []
                                    }
                                    value={
                                        data.artworks.map((artwork) => ({
                                            value: artwork.id,
                                            label: artwork.title,
                                        })) || []
                                    }
                                    onChange={(selectedOptions => {
                                        setData('artworks', artworks?.data.filter((artwork) =>
                                            selectedOptions.some((option) => option.value === artwork.id)
                                        ));
                                    })}
                                    styles={handleReactSelectStyling()}
                                />
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
