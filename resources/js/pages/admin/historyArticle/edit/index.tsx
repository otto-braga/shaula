import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Award } from '@/types/award';
import { Category } from '@/types/category';
import { Language } from '@/types/language';
import { Person } from '@/types/person';
import { HistoryArticle } from '@/types/history-article';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import Tabs from './tabs';
import { Period } from '@/types/period';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: '/admin/historyArticle',
    },
];

export default function Index({
    historyArticle,
    people,
    categories,
    periods,
}: {
    historyArticle: { data: HistoryArticle };
    people?: { data: Person[] };
    categories?: { data: Category[] };
    periods?: { data: Period[] };
}) {
    const isEdit = !!historyArticle;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: historyArticle ? historyArticle.data.title : '',
        date: historyArticle ? historyArticle.data.date : '',
        authors: historyArticle ? historyArticle.data.authors : [],

        categories: historyArticle ? historyArticle.data.categories?.map((category) => ({ id: category.id, name: category.name, label: category.name })) : [],
        periods: historyArticle ? historyArticle.data.periods?.map((period) => ({ id: period.id, name: period.name, label: period.name })) : [],
    });

    console.log('historyArticle', periods);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('historyArticle.update', historyArticle.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('historyArticle.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    const [availablePeople, setAvailablePeople] = useState<Person[]>(people?.data || []);
    const [selectedPeople, setSelectedPeople] = useState<Person[]>(historyArticle?.data.authors || []);

    useEffect(() => {
        setData('authors', selectedPeople);
    }, [selectedPeople]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs historyArticle={historyArticle} processing={processing} />
                            {isEdit}

                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="authors_ids">Autores</Label>
                                <Select
                                    id="authors"
                                    isMulti
                                    options={availablePeople.map((person) => ({ value: person.id, label: person.name }))}
                                    value={selectedPeople.map((person) => ({ value: person.id, label: person.name }))}
                                    onChange={(options) => {
                                        setSelectedPeople(
                                            availablePeople.filter((person) => options.map((option) => option.value).includes(person.id)),
                                        );
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.authors} />
                            </div>

                            <div className="flex flex-row gap-3">
                                <div className="w-full">
                                    <Label htmlFor="date">Data</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date ?? ''}
                                        onChange={(e) => setData('date', e.target.value)}
                                        autoComplete="date"
                                        className="w-full"
                                    />
                                    <InputError className="mt-2" message={errors.date} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <Select
                                    id="categories"
                                    isMulti
                                    options={categories?.data.map((category) => ({ value: category.id, label: category.name }))}
                                    value={data.categories.map((category) => ({ value: category.id, label: category.label }))}
                                    onChange={(options) => {
                                        setData(
                                            'categories',
                                            options.map((option) => ({ id: option.value, name: option.label, label: option.label })),
                                        );
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.categories} />
                            </div>

                            <div>
                                <Label htmlFor="periods">Períodos</Label>
                                <Select
                                    id="periods"
                                    isMulti
                                    options={periods?.data.map((period) => ({ value: period.id, label: period.name }))}
                                    value={data.periods.map((period) => ({ value: period.id, label: period.label }))}
                                    onChange={(options) => {
                                        setData(
                                            'periods',
                                            options.map((option) => ({ id: option.value, name: option.label, label: option.label })),
                                        );
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.periods} />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
