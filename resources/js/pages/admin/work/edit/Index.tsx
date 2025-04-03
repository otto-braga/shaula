import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Tabs from './Tabs';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Input, TextField } from '@mui/material';
import Select from 'react-select';
import { Person, personLabel } from '@/types/person';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';

interface WorkType {
    value: string,
    label: string,
}

export default function Index({
    work,
    work_types,
    people,
}: PageProps<{
    work: { data: Work },
    work_types?: { data: WorkType[] },
    people?: { data: Person[] },
}>) {

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
        work_types?.data.find((type) => type.value === data.work_type) || work_types?.data[0] || { value: '', label: '' }
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
        setData('new_people_names', newPeople.map((person) => person.name));
        setTotalSelectedPeople(selectedPeople.concat(newPeople))
    }, [newPeople]);

    useEffect(() => {
        setData('authors_ids', selectedPeople.filter((person) => (person.id > 0)).map((person) => person.id));
        setTotalSelectedPeople(selectedPeople.concat(newPeople))
    }, [selectedPeople]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="">
                    Editor
                </h2>
            }
        >
            <Head title={'Editor'} />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">
                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="space-y-6 bg-inherit">

                            <Tabs work={work} processing={processing} />

                            <div>
                                <InputLabel htmlFor="work_type" value="Tipo de Produção" />
                                <Select
                                    id="work_type"
                                    options={work_types?.data}
                                    defaultValue={selectedWorkType}
                                    onChange={(option) => {
                                        setSelectedWorkType(option as WorkType);
                                        setData('work_type', (option as WorkType).value);
                                    }}
                                    className='w-full'
                                    isDisabled={isEdit}
                                />
                                <InputError className="mt-2" message={errors.work_type} />
                            </div>

                            <div>
                                <InputLabel htmlFor="title" value="Título" />
                                <TextField
                                    id="title"
                                    value={data.title ?? ''}
                                    onChange={(e) => setData('title', e.target.value)}
                                    fullWidth
                                    autoComplete='title'
                                    multiline
                                    rows={2}
                                    variant='outlined'
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <InputLabel htmlFor="authors_ids" value="Autores" />
                                <CreatableSelect
                                    id="authors_ids"
                                    isMulti
                                    options={availablePeople.map((person) => ({ value: person.id, label: personLabel(person) }))}
                                    value={totalSelectedPeople.map((person) => ({ value: person.id, label: personLabel(person) }))}
                                    onCreateOption={(name) => addNewPerson({ id: -1, name: name } as Person)}
                                    onChange={(options) => {
                                        setSelectedPeople(availablePeople.filter((person) => options.map((option) => option.value).includes(person.id)));
                                    }}
                                    className='w-full'
                                />
                                <InputError className="mt-2" message={errors.authors_ids} />
                            </div>

                            <div className='flex flex-row gap-8'>
                                <div className='w-full'>
                                    <InputLabel htmlFor="date" value="Data" />
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date ?? ''}
                                        onChange={(e) => setData('date', e.target.value)}
                                        autoComplete='date'
                                        className='w-full'
                                    />
                                    <InputError className="mt-2" message={errors.date} />
                                </div>
                                <div className='w-full'>
                                    <InputLabel htmlFor="date_end" value="Data de Término" />
                                    <Input
                                        id="date_end"
                                        type="date"
                                        value={data.date_end ?? ''}
                                        onChange={(e) => setData('date_end', e.target.value)}
                                        autoComplete='date_end'
                                        className='w-full'
                                    />
                                    <InputError className="mt-2" message={errors.date_end} />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Descrição" />
                                <TextField
                                    id="description"
                                    value={data.description ?? ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    fullWidth
                                    autoComplete='description'
                                    multiline
                                    rows={4}
                                    variant='outlined'
                                />
                                <InputError className="mt-2" message={errors.description} />
                            </div>
                        </form>
                    </div>
                </div>
            </section>

        </AuthenticatedLayout>
    )
}