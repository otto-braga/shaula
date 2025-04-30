import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Artwork } from '@/types/artwork';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import Tabs from './tabs';
import { Language } from '@/types/language';
import { Award } from '@/types/award';
import { Category } from '@/types/category';
import { Period } from '@/types/period';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obras',
        href: '/admin/artwork',
    },
];

type Option = {
    value: number;
    label: string;
};

export default function Index({
    artwork,
    // people,
    languages,
    awards,
    categories,
    periods,
}: {
    artwork: { data: Artwork },
    // people?: { data: Person[] },
    languages?: { data: Language[] },
    awards?: { data: Award[] },
    categories?: { data: Category[] },
    periods?: { data: Period[] },
}) {
    const isEdit = !!artwork;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: artwork ? artwork.data.title : '' as string,
        date: artwork ? artwork.data.date : '' as string,
        authors_ids: artwork ? artwork.data.authors.map((author) => author.id) : [] as number[],

        languages: artwork ? artwork.data.languages?.map((language) => ({ id: language.id, name: language.name, label: language.name })) : [],
        awards: artwork ? artwork.data.awards?.map((award) => ({ id: award.id, name: award.name, label: award.name })) : [],
        categories: artwork ? artwork.data.categories?.map((category) => ({ id: category.id, name: category.name, label: category.name })) : [],

        periods: artwork ? artwork.data.periods?.map((period) => ({ id: period.id, name: period.name, label: period.name })) : [],

        dimensions: artwork ? artwork.data.dimensions : '',
        materials: artwork ? artwork.data.materials : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('artworks.update', artwork.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('artworks.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    const fetchData = async (route: string = '', search: string = '', setFunction: (test: MultiValue<Option>) => void) => {
        if (search.length < 1) {
            return;
        }

        let response;

        fetch(
            route,
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            })
            .then((res) => res.json())
            .then((data) => {
                response = data;
                setFunction(
                    response.map((object: any) => ({
                        value: object.id,
                        label: object.name ?? object.title,
                    }) as Option) as MultiValue<Option>
                );
            });

        return response;
    };

    const [availablePeople, setAvailablePeople] = useState<MultiValue<Option>>([]);
    const [selectedPeople, setSelectedPeople] = useState<MultiValue<Option>>(artwork.data.authors?.map(author => ({ value: author.id, label: author.name })) ?? []);

    const fetchPeople = async (search: string = '') => {
        if (search.length < 1) {
            return;
        }

        let response;

        fetch(route('people.fetch', { search: search }),
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            })
            .then((res) => res.json())
            .then((data) => {
                response = data as Person[];
                console.log('response', response);
                setAvailablePeople(
                    response.map((person) => ({
                        value: person.id,
                        label: person.name,
                    }) as Option) as MultiValue<Option>
                );
            });
        return response;
    };

    const onPeopleChange = (options: MultiValue<Option>) => {
        setSelectedPeople(options);
        setAvailablePeople([]);
        setData('authors_ids', options.map((option) => (option.value)));
    };

    const onPeopleInputChange = (inputValue: string) => {
        fetchData(route('people.fetch', { search: inputValue }), inputValue, setAvailablePeople);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} />
                            {isEdit}

                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="authors_ids">Autores</Label>
                                <Select
                                    id="authors_ids"
                                    isMulti
                                    options={availablePeople}
                                    value={selectedPeople}
                                    onChange={onPeopleChange}
                                    styles={handleReactSelectStyling()}
                                    onInputChange={onPeopleInputChange}
                                />
                                <InputError className="mt-2" message={errors.authors_ids} />
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
                                <Label htmlFor="dimensions">Dimensões</Label>
                                <Input
                                    id="title"
                                    value={data.dimensions ?? ''}
                                    onChange={(e) => setData('dimensions', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.dimensions} />
                            </div>

                            <div>
                                <Label htmlFor="materials">Materiais</Label>
                                <Input
                                    id="materials"
                                    value={data.materials ?? ''}
                                    onChange={(e) => setData('materials', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.materials} />
                            </div>

                            <div>
                                <Label htmlFor="languages">Linguagens</Label>
                                <Select
                                    id="languages"
                                    isMulti
                                    options={languages?.data.map((language) => ({ value: language.id, label: language.name }))}
                                    value={data.languages.map((language) => ({ value: language.id, label: language.label }))}
                                    onChange={(options) => {
                                        setData('languages', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.languages} />
                            </div>

                            <div>
                                <Label htmlFor="awards">Prêmios</Label>
                                <Select
                                    id="awards"
                                    isMulti
                                    options={awards?.data.map((award) => ({ value: award.id, label: award.name }))}
                                    value={data.awards.map((award) => ({ value: award.id, label: award.label }))}
                                    onChange={(options) => {
                                        setData('awards', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.awards} />
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <Select
                                    id="categories"
                                    isMulti
                                    options={categories?.data.map((category) => ({ value: category.id, label: category.name }))}
                                    value={data.categories.map((category) => ({ value: category.id, label: category.label }))}
                                    onChange={(options) => {
                                        setData('categories', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
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
                                        setData('periods', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
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
