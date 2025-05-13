import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { City } from '@/types/city';
import { Gender } from '@/types/gender';
import { Period } from '@/types/period';
import { Person } from '@/types/person';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import Select from 'react-select';
import Tabs from './tabs';

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';

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
    person: { data: Person };
    genders: { data: Gender[] };
    cities: { data: City[] };
    periods: { data: Period[] };
}) {
    const isEdit = !!person;

    const { data, setData, post, errors, processing } = useForm({
        name: person ? person.data.name : '',
        date_of_birth: person ? person.data.date_of_birth : '',
        date_of_death: person ? person.data.date_of_death : '',

        genders_ids: person ? person.data.genders?.map((gender) => gender.id) : [] as number[],
        cities_ids: person ? person.data.cities?.map((city) => city.id) : [] as number[],
        periods_ids: person ? person.data.periods?.map((period) => period.id) : [] as number[],

        links: person ? person.data.links : '',
        chronology: person ? person.data.chronology : '',
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

    const editorLinksRef = useRef<TinyMCEEditor | null>(null);

    function onLinksInput(e: any) {
        setData('links', editorLinksRef?.current?.getContent() ?? String());
    }

    const editorChronologyRef = useRef<TinyMCEEditor | null>(null);

    function onChronologyInput(e: any) {
        setData('chronology', editorChronologyRef?.current?.getContent() ?? String());
    }

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
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        person?.data.genders?.map(
                                            gender => ({ value: gender.id, label: gender.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'genders.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('genders_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.genders_ids} />
                            </div>

                            <div>
                                <Label htmlFor="cities">Cidades</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        person?.data.cities?.map(
                                            city => ({ value: city.id, label: city.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'cities.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('cities_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.cities_ids} />
                            </div>

                            <div>
                                <Label htmlFor="periods">Períodos</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        person?.data.periods?.map(
                                            period => ({ value: period.id, label: period.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'periods.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('periods_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.periods_ids} />
                            </div>

                            <div>
                                <Label htmlFor="links">Links relacionados</Label>
                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorLinksRef.current = editor}
                                    initialValue={person.data.links as string || String()}
                                    init={{
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                                            'autoresize',
                                        ],

                                        min_height: 150,
                                        autoresize_bottom_margin: 0,

                                        menubar: false,

                                        skin: document.documentElement.classList.contains('dark') ? "oxide-dark" : "oxide",
                                        content_css: document.documentElement.classList.contains('dark') ? "dark" : "default",

                                        toolbar: 'undo redo | link',

                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',

                                        paste_preprocess: (editor, args) => {
                                            const blob = args.content.match(/<img src="blob:.*">/g);

                                            if (blob) {
                                                args.content = '';
                                            }
                                        },

                                        paste_block_drop: true,
                                    }}
                                    onEditorChange={onLinksInput}
                                />
                            </div>

                            <div>
                                <Label htmlFor="chronology">Cronologia</Label>
                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorChronologyRef.current = editor}
                                    initialValue={person.data.chronology as string || String()}
                                    init={{
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                                            'autoresize',
                                        ],

                                        min_height: 400,
                                        autoresize_bottom_margin: 0,

                                        menubar: false,

                                        skin: document.documentElement.classList.contains('dark') ? "oxide-dark" : "oxide",
                                        content_css: document.documentElement.classList.contains('dark') ? "dark" : "default",

                                        toolbar: 'undo redo | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify |  outdent indent | ' +
                                            'removeformat',

                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',

                                        paste_preprocess: (editor, args) => {
                                            const blob = args.content.match(/<img src="blob:.*">/g);

                                            if (blob) {
                                                args.content = '';
                                            }
                                        },

                                        paste_block_drop: true,
                                    }}
                                    onEditorChange={onChronologyInput}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
