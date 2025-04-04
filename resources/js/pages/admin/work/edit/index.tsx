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
import Tabs from './Tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

interface WorkType {
    value: string;
    label: string;
}

export default function Index({
    work,
    work_types,
    people,
}: {
    work: { data: Work };
    work_types?: { data: WorkType[] };
    people?: { data: Person[] };
}) {
    const isEdit = !!work;

    // form

    const { data, setData, post, patch, errors, processing } = useForm({
        work_type: work ? work.data.work_type : work_types?.data[0].value,
        title: work ? work.data.title : '',
        date: work ? work.data.date : '',
        date_end: work ? work.data.date_end : '',
        description: work ? work.data.description : '',
        authors_ids: work ? work.data.authors.map((author) => author.id) : [],
        new_people_names: Array<string>(),
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

    const [selectedWorkType, setSelectedWorkType] = useState<WorkType>(
        work_types?.data.find((type) => type.value === data.work_type) || work_types?.data[0] || { value: '', label: '' },
    );

    useEffect(() => {
        setData('work_type', selectedWorkType?.value ?? '');
    }, [selectedWorkType]);

    // people

    const [availablePeople, setAvailablePeople] = useState<Person[]>(people?.data || []);
    const [selectedPeople, setSelectedPeople] = useState<Person[]>(work?.data.authors || []);
    const [newPeople, setNewPeople] = useState<Person[]>([]);
    const [totalSelectedPeople, setTotalSelectedPeople] = useState<Person[]>([]);

    function addNewPerson(newPerson: Person) {
        if (newPeople.find((person) => person.name === newPerson.name)) return;
        setNewPeople([...newPeople, newPerson]);
    }

    useEffect(() => {
        setData(
            'new_people_names',
            newPeople.map((person) => person.name),
        );
        setTotalSelectedPeople(selectedPeople.concat(newPeople));
    }, [newPeople]);

    useEffect(() => {
        setData(
            'authors_ids',
            selectedPeople.filter((person) => person.id > 0).map((person) => person.id),
        );
        setTotalSelectedPeople(selectedPeople.concat(newPeople));
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
                                <Label htmlFor="work_type">Tipo de Produção</Label>
                                <Select
                                    id="work_type"
                                    options={work_types?.data}
                                    defaultValue={selectedWorkType}
                                    onChange={(option) => {
                                        setSelectedWorkType(option as WorkType);
                                        setData('work_type', (option as WorkType).value);
                                    }}
                                    className="w-full"
                                    isDisabled={isEdit}
                                    styles={{
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: '#d2d2d2',
                                        }),
                                        option(base, props) {
                                            return {
                                                ...base,
                                                backgroundColor: props.isFocused ? '#d2d2d2' : 'white',
                                                color: props.isFocused ? 'white' : 'black',
                                            };
                                        },
                                    }}
                                />
                                <InputError className="mt-2" message={errors.work_type} />
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
                                    value={totalSelectedPeople.map((person) => ({ value: person.id, label: person.name }))}
                                    onChange={(options) => {
                                        setSelectedPeople(
                                            availablePeople.filter((person) => options.map((option) => option.value).includes(person.id)),
                                        );
                                    }}
                                    isDisabled={isEdit}
                                    styles={{
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: '#d2d2d2',
                                        }),
                                        option(base, props) {
                                            return {
                                                ...base,
                                                backgroundColor: props.isFocused ? '#d2d2d2' : 'white',
                                                color: props.isFocused ? 'white' : 'black',
                                            };
                                        },
                                    }}
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
