import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Work } from '@/types/work';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
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
}: {
    work: { data: Work };
    workable_types?: { data: WorkableType[] };
    people?: { data: Person[] };
}) {
    const isEdit = !!work;

    // form

    const { data, setData, post, patch, errors, processing } = useForm({
        workable_type: work ? work.data.workable_type : workable_types?.data[0].value,
        title: work ? work.data.title : '',
        date: work ? work.data.date : '',
        date_end: work ? work.data.date_end : '',
        description: work ? work.data.description : '',
        authors_ids: work ? work.data.authors.map((author) => author.id) : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data);

        if (isEdit) {
            patch(route('work.update', work.data.uuid), {
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

    // work type

    const [selectedWorkableType, setSelectedWorkableType] = useState<WorkableType>(
        workable_types?.data.find((type) => type.value === data.workable_type) || workable_types?.data[0] || { value: '', label: '' },
    );

    useEffect(() => {
        setData('workable_type', selectedWorkableType?.value ?? '');
    }, [selectedWorkableType]);

    // people

    const [availablePeople, setAvailablePeople] = useState<Person[]>(people?.data || []);
    const [selectedPeople, setSelectedPeople] = useState<Person[]>(work?.data.authors || []);

    useEffect(() => {
        // order seleceted people by name
        setData('authors_ids', selectedPeople.map((person) => person.id));
    }, [selectedPeople]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs work={work} processing={processing} />
                            {isEdit}
                            <div className="max-w-sm">
                                <Label htmlFor="workable_type">Tipo de Produção</Label>
                                <Select
                                    id="workable_type"
                                    options={workable_types?.data}
                                    defaultValue={selectedWorkableType}
                                    onChange={(option) => {
                                        setSelectedWorkableType(option as WorkableType);
                                        setData('workable_type', (option as WorkableType).value);
                                    }}
                                    className="w-full"
                                    isDisabled={isEdit}
                                    styles={handleReactSelectStyling()}

                                />
                                <InputError className="mt-2" message={errors.workable_type} />
                            </div>

                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div className="max-w-sm">
                                <Label htmlFor="authors_ids">Autores</Label>
                                <Select
                                    id="authors_ids"
                                    isMulti
                                    options={availablePeople.map((person) => ({ value: person.id, label: person.name }))}
                                    value={selectedPeople.map((person) => ({ value: person.id, label: person.name }))}
                                    onChange={(options) => {
                                        setSelectedPeople(
                                            availablePeople.filter((person) => options.map((option) => option.value).includes(person.id))
                                        );
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.authors_ids} />
                            </div>

                            <div className="flex flex-row gap-3">
                                <div>
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
                                <div>
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
