import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Review } from '@/types/review';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import Tabs from './tabs';
import { Language } from '@/types/language';
import { Award } from '@/types/award';
import { Category } from '@/types/category';
import { Gender } from '@/types/gender';
import { City } from '@/types/city';
import { Period } from '@/types/period';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: '/admin/pessoas',
    },
];

export default function Index({
    person,
    genders,
    cities,
    periods,
}: {
    person: { data: Person },
    genders: { data: Gender[] },
    cities: { data: City[] },
    periods: { data: Period[] },
}) {
    const isEdit = !!person;

    const { data, setData, post, patch, errors, processing } = useForm({
        name: person ? person.data.name : '',
        date_of_birth: person ? person.data.date_of_birth : '',
        date_of_death: person ? person.data.date_of_death : '',
        genders: person ? person.data.genders?.map((gender) => ({ id: gender.id, label: gender.name })) : [],
        cities: person ? person.data.cities?.map((city) => ({ id: city.id, label: city.name })) : [],
        periods: person ? person.data.periods?.map((period) => ({ id: period.id, label: period.name })) : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('people.update', person.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('people.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs person={person} processing={processing} />
                            {isEdit}

                            <div>
                                <Label htmlFor="title">Nome</Label>
                                <Input id="title" value={data.name ?? ''} onChange={(e) => setData('name', e.target.value)} autoComplete="name" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="flex flex-row gap-3">

                                <div className="w-full">
                                    <Label htmlFor="date">Data de Nascimento</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth ?? ''}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        autoComplete="date"
                                        className="w-full"
                                    />
                                    <InputError className="mt-2" message={errors.date_of_birth} />
                                </div>

                                <div className="w-full">
                                    <Label htmlFor="date">Data de Falecimento</Label>
                                    <Input
                                        id="date_of_death"
                                        type="date"
                                        value={data.date_of_death ?? ''}
                                        onChange={(e) => setData('date_of_death', e.target.value)}
                                        autoComplete="date"
                                        className="w-full"
                                    />
                                    <InputError className="mt-2" message={errors.date_of_death} />
                                </div>

                            </div>

                            <div>
                                <Label htmlFor="genders"></Label>
                                <Select
                                    id="genders"
                                    isMulti
                                    options={genders?.data.map((gender) => ({ value: gender.id, label: gender.name }))}
                                    value={data.genders?.map((gender) => ({ value: gender.id, label: gender.label }))}
                                    onChange={(options) => {
                                        setData('genders', options.map((option) => (
                                            { id: option.value, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.genders} />
                            </div>

                            <div>
                                <Label htmlFor="cities">Cidades</Label>
                                <Select
                                    id="cities"
                                    isMulti
                                    options={cities?.data.map((city) => ({ value: city.id, label: city.name }))}
                                    value={data.cities?.map((city) => ({ value: city.id, label: city.label }))}
                                    onChange={(options) => {
                                        setData('cities', options.map((option) => (
                                            { id: option.value, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.cities} />
                            </div>

                            <div>
                                <Label htmlFor="periods">Períodos</Label>
                                <Select
                                    id="periods"
                                    isMulti
                                    options={periods?.data.map((period) => ({ value: period.id, label: period.name }))}
                                    value={data.periods?.map((period) => ({ value: period.id, label: period.label }))}
                                    onChange={(options) => {
                                        setData('periods', options.map((option) => (
                                            { id: option.value, label: option.label }
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
