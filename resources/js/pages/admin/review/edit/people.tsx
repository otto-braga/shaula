import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Activity } from '@/types/activity';
import { Person, personLabel } from '@/types/person';
import { Review } from '@/types/review';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import Tabs from './tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: route('reviews.index'),
    },
];

export default function People({
    review,
    people,
}: {
    review: { data: Review };
    people: { data: Person[] };
}) {
    const { data, setData, post, errors, processing } = useForm({
        people: review ? review.data.people : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('reviews.update.people', review.data), {
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
                                    id="people_ids"
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
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
