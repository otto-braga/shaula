import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Person } from '@/types/person';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import EditTabs from '@/components/edit/edit-tabs';

export default function Index({
    person,
}: {
    person: { data: Person };
}) {
    const isEdit = !!person;

    const { data, setData, post, errors, processing } = useForm({
        name: person ? person.data.name : '',
        date_of_birth: person ? person.data.date_of_birth : '',
        date_of_death: person ? person.data.date_of_death : '',

        genders_ids: person ? person.data.genders?.map((gender) => gender.id) : ([] as number[]),
        cities_ids: person ? person.data.cities?.map((city) => city.id) : ([] as number[]),
        periods_ids: person ? person.data.periods?.map((period) => period.id) : ([] as number[]),

        links: person ? person.data.links : '',
        chronology: person ? person.data.chronology : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

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

    const editorLinksRef = useRef<TinyMCEEditor | null>(null);

    function onLinksInput(e: any) {
        setData('links', editorLinksRef?.current?.getContent() ?? String());
    }

    return (
        <AppLayout>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <EditTabs
                                model={person}
                                route_base_name="people"
                                processing={processing}
                            />

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
                                <LazyLoadingMultiSelect
                                    initialOptions={person?.data.genders?.map((gender) => ({ value: gender.id, label: gender.name })) ?? []}
                                    routeName={'genders.fetch.options'}
                                    setterFunction={(options) => {
                                        setData(
                                            'genders_ids',
                                            options.map((option) => option.value),
                                        );
                                    }}
                                />
                                <InputError className="mt-2" message={errors.genders_ids} />
                            </div>

                            <div>
                                <Label htmlFor="cities">Cidades</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={person?.data.cities?.map((city) => ({ value: city.id, label: city.name })) ?? []}
                                    routeName={'cities.fetch.options'}
                                    setterFunction={(options) => {
                                        setData(
                                            'cities_ids',
                                            options.map((option) => option.value),
                                        );
                                    }}
                                />
                                <InputError className="mt-2" message={errors.cities_ids} />
                            </div>

                            <div>
                                <Label htmlFor="periods">Periodização</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={person?.data.periods?.map((period) => ({ value: period.id, label: period.name })) ?? []}
                                    routeName={'periods.fetch.options'}
                                    setterFunction={(options) => {
                                        setData(
                                            'periods_ids',
                                            options.map((option) => option.value),
                                        );
                                    }}
                                />
                                <InputError className="mt-2" message={errors.periods_ids} />
                            </div>

                            <div>
                                <Label htmlFor="links">Links relacionados</Label>
                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorLinksRef.current = editor}
                                    initialValue={person?.data.links as string || String()}
                                    init={{
                                        plugins: [
                                            'autolink', 'lists', 'link',
                                            'autoresize',
                                        ],

                                        min_height: 150,
                                        autoresize_bottom_margin: 0,

                                        menubar: false,

                                        skin: document.documentElement.classList.contains('dark') ? "oxide-dark" : "oxide",
                                        content_css: document.documentElement.classList.contains('dark') ? "dark" : "default",

                                        toolbar: 'link | undo redo',

                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',
                                    }}
                                    onEditorChange={onLinksInput}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
