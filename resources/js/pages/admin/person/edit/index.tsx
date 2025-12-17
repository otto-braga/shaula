import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Person } from '@/types/person';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import EditTabs from '@/components/edit/edit-tabs';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { MultiValue } from 'react-select';
import { SearchResult } from '@/types/search-result';
import EditLayout from '@/components/edit/edit-layout';

export default function Index({
    person,
}: {
    person: { data: Person };
}) {
    const isEdit = !!person;

    const { data, setData, post, processing } = useForm({
        name: person ? person.data.name : '',
        date_of_birth: person ? person.data.date_of_birth : '',
        date_of_death: person ? person.data.date_of_death : '',

        genders_uuids: person ? person.data.genders?.map((gender) => gender.uuid) : ([] as string[]),
        cities_uuids: person ? person.data.cities?.map((city) => city.uuid) : ([] as string[]),
        periods_uuids: person ? person.data.periods?.map((period) => period.uuid) : ([] as string[]),
        awards_uuids: person ? person.data.awards?.map((award) => award.uuid) : [] as string[],

        links: person ? person.data.links : '',
        chronology: person ? person.data.chronology : '',
    });
    const { errors } = usePage().props

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
        <EditLayout>
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

                <div className="flex flex-col sm:flex-row gap-3">
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
                    <Label htmlFor="genders">Identidades de gênero</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'genders.fetch.options'}
                        value={person?.data.genders?.map(
                            gender => ({ uuid: gender.uuid, label: gender.name })
                        )}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData('genders_uuids', options.map((option) => (option.uuid)));
                        }}
                    />
                    <InputError className="mt-2" message={errors.genders_uuids} />
                </div>

                <div>
                    <Label htmlFor="cities">Cidades</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'cities.fetch.options'}
                        value={person?.data.cities?.map(
                            city => ({ uuid: city.uuid, label: city.name })
                        )}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData('cities_uuids', options.map((option) => (option.uuid)));
                        }}
                    />
                    <InputError className="mt-2" message={errors.cities_uuids} />
                </div>

                <div>
                    <Label htmlFor="periods">Periodização</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'periods.fetch.options'}
                        value={person?.data.periods?.map(
                            period => ({ uuid: period.uuid, label: period.name })
                        )}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData('periods_uuids', options.map((option) => (option.uuid)));
                        }}
                    />
                    <InputError className="mt-2" message={errors.periods_uuids} />
                </div>

                <div>
                    <Label htmlFor="awards_uuids">Prêmios</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'awards.fetch.options'}
                        value={person?.data.awards?.map(
                            award => ({ uuid: award.uuid, label: award.name })
                        )}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData('awards_uuids', options.map((option) => (option.uuid)))
                        }}
                    />
                    <InputError className="mt-2" message={errors.awards_uuids} />
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
                    <InputError className="mt-2" message={errors.links} />
                </div>

                <div>
                    <Label htmlFor="chronology">Cronologia</Label>
                    <Editor
                        tinymceScriptSrc='/tinymce/tinymce.min.js'
                        licenseKey='gpl'
                        onInit={(_evt, editor) => editorChronologyRef.current = editor}
                        initialValue={person?.data.chronology as string || String()}
                        init={{
                            plugins: [
                                'autolink', 'lists', 'autoresize',
                            ],

                            min_height: 150,
                            autoresize_bottom_margin: 0,

                            menubar: false,

                            skin: document.documentElement.classList.contains('dark') ? "oxide-dark" : "oxide",
                            content_css: document.documentElement.classList.contains('dark') ? "dark" : "default",

                            toolbar: 'undo redo',

                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',
                        }}
                        onEditorChange={onChronologyInput}
                    />
                    <InputError className="mt-2" message={errors.chronology} />
                </div>
            </form>
    </EditLayout>
    );
}
