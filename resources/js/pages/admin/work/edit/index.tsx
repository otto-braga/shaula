import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Work } from '@/types/work';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import Tabs from './Tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

interface WorkableType {
    value: string;
    label: string;
}

export default function Index({
    work,
    workable_types,
    people,
    default_workable_type,
}: {
    work: { data: Work };
    workable_types?: { data: WorkableType[] };
    people?: { data: Person[] };
    default_workable_type?: string;
}) {
    const isEdit = !!work;

    // -------------------------------------------------------------------------
    // form

    const { data, setData, post, patch, errors, processing } = useForm({
        //acho que pode ser só : default_workable_type sem o || ...
        workable_type: work ? work.data.workable_type : default_workable_type || workable_types?.data[0]?.value,
        title: work ? work.data.title : '',
        date: work ? work.data.date : '',
        date_end: work ? work.data.date_end : '',
        description: work ? work.data.description : '',
        authors_ids: work ? work.data.authors.map((author) => author.id) : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('work.update', work.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('work.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    // -------------------------------------------------------------------------
    // work type

    const [selectedWorkableType, setSelectedWorkableType] = useState<WorkableType>(
        workable_types?.data.find((type) => type.value === data.workable_type) || workable_types?.data[0] || { value: '', label: '' },
    );

    useEffect(() => {
        setData('workable_type', selectedWorkableType?.value ?? '');
    }, [selectedWorkableType]);

    // -------------------------------------------------------------------------
    // people

    const [availablePeople, setAvailablePeople] = useState<Person[]>(people?.data || []);
    const [selectedPeople, setSelectedPeople] = useState<Person[]>(work?.data.authors || []);

    useEffect(() => {
        setData(
            'authors_ids',
            selectedPeople.map((person) => person.id),
        );
    }, [selectedPeople]);

    // -------------------------------------------------------------------------
    // render

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs work={work} processing={processing} />
                            {isEdit}
                            <div>
                                <Label htmlFor="workable_type">Tipo de Produção</Label>
                                <Select
                                    id="workable_type"
                                    options={workable_types?.data}
                                    defaultValue={selectedWorkableType}
                                    onChange={(option) => {
                                        setSelectedWorkableType(option as WorkableType);
                                        setData('workable_type', (option as WorkableType).value);
                                    }}
                                    styles={handleReactSelectStyling(true)}
                                    isDisabled={default_workable_type ? true : isEdit}
                                />
                                <InputError className="mt-2" message={errors.workable_type} />
                            </div>

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
                                    options={availablePeople.map((person) => ({ value: person.id, label: person.name }))}
                                    value={selectedPeople.map((person) => ({ value: person.id, label: person.name }))}
                                    onChange={(options) => {
                                        setSelectedPeople(
                                            availablePeople.filter((person) => options.map((option) => option.value).includes(person.id)),
                                        );
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.authors_ids} />
                            </div>

                            <div className="flex flex-row gap-3">
                                <div className="w-full">
                                    <Label htmlFor="date">Data de Início</Label>
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
                                <div className="w-full">
                                    <Label htmlFor="date_end">Data de término</Label>
                                    <Input
                                        id="date_end"
                                        type="date"
                                        value={data.date_end ?? ''}
                                        onChange={(e) => setData('date_end', e.target.value)}
                                        autoComplete="date_end"
                                        className="w-full"
                                    />
                                    <InputError className="mt-2" message={errors.date_end} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Descrição</Label>
                                <Input
                                    id="description"
                                    value={data.description ?? ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    autoComplete="description"
                                />
                                <InputError className="mt-2" message={errors.description} />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
