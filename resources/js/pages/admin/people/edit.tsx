import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Gender } from '@/types/gender';
import { Person } from '@/types/person';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import { Head, useForm } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { Editor as TinyMCEEditor } from 'tinymce';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: '/admin/pessoas',
    },
];

type SelectOption = {
    value: number;
    label: string;
};

export default function Index({ person, genders }: { person: { data: Person }; genders: Gender[] }) {
    const isEdit = !!person;

    const { data, setData, post, errors, processing } = useForm({
        name: person ? person.data.name : '',
        date_of_birth: person ? person.data.date_of_birth : '',
        date_of_death: person ? person.data.date_of_death : '',
        bio: person ? person.data.bio : '',
        chrono: person ? person.data.chrono : '',
        image: null as File | null,
        genders: person ? person.data.genders?.map((gender: Gender) => ({ value: gender.id, label: gender.name })) : Array<SelectOption>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('person.update', { uuid: person.data.uuid }), {
                preserveScroll: true,
            });
        } else {
            post(route('person.store'));
        }
    };

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (data.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(data.image);
        } else {
            setImagePreview(null);
        }
    }, [data.image]);

    function onContentInput() {
        setData('bio', editorRef?.current?.getContent() ?? String());
    }

    const editorRef = useRef<TinyMCEEditor | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Editar pessoa' : 'Criar pessoa'}`} />
            <div className="mx-auto mt-3 px-3">
                <form onSubmit={submit} className="max-w-lg space-y-3">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>

                        <Input
                            id="name"
                            className="block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Nome"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>
                    <div>
                        <Select
                            id="genders"
                            options={genders?.map(({ id, name }) => ({
                                value: id,
                                label: name,
                            }))}
                            defaultValue={data.genders}
                            isMulti
                            isSearchable
                            onChange={(selectedOptions) => {
                                setData('genders', selectedOptions as { value: number; label: string }[]);
                                console.log(selectedOptions);
                            }}
                            placeholder="Selecione os gêneros"
                            styles={handleReactSelectStyling()}
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Biografia</Label>
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            licenseKey="gpl"
                            onInit={(_evt, editor) => (editorRef.current = editor)}
                            initialValue={(person?.data.bio as string) || String()}
                            init={{
                                plugins: [
                                    'advlist',
                                    'autolink',
                                    'lists',
                                    'link',
                                    'charmap',
                                    'anchor',
                                    'searchreplace',
                                    'visualblocks',
                                    'code',
                                    'fullscreen',
                                    'insertdatetime',
                                    'media',
                                    'table',
                                    'preview',
                                    'help',
                                    'wordcount',
                                    'autoresize',
                                ],

                                // toolbar_sticky: true,
                                // toolbar_sticky_offset: 100,

                                // min_height: 300,
                                // autoresize_bottom_margin: 0,

                                menubar: false,

                                toolbar:
                                    'undo redo | ' +
                                    'gallery | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify |  outdent indent | ' +
                                    'removeformat',

                                content_style:
                                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',

                                paste_preprocess: (editor, args) => {
                                    const blob = args.content.match(/<img src="blob:.*">/g);

                                    if (blob) {
                                        args.content = '';
                                    }
                                },

                                paste_block_drop: true,

                                // setup: (editor) => {
                                //     editor.ui.registry.addButton('gallery', {
                                //         text: 'Galeria',
                                //         onAction: () => {
                                //             setShowGallery(true);
                                //         },
                                //     });
                                // },
                            }}
                            onEditorChange={onContentInput}
                        />
                        <InputError className="mt-2" message={errors.bio} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date_of_birth">Data de Nascimento</Label>

                        <Input
                            id="date_of_birth"
                            type="date"
                            className="block w-full"
                            value={data.date_of_birth || ''}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                            required
                            autoComplete="date_of_birth"
                        />

                        <InputError className="mt-2" message={errors.date_of_birth} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date_of_death">Data de Falecimento</Label>

                        <Input
                            id="date_of_death"
                            type="date"
                            className="block w-full"
                            value={data.date_of_death || ''}
                            onChange={(e) => setData('date_of_death', e.target.value)}
                            autoComplete="date_of_death"
                        />

                        <InputError className="mt-2" message={errors.date_of_death} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Imagem</Label>

                        <Input
                            id="image"
                            type="file"
                            className="block w-full"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setData('image', e.target.files[0]);
                                }
                            }}
                        />

                        <InputError className="mt-2" message={errors.image} />
                    </div>
                    {imagePreview && (
                        <div className="grid gap-2">
                            <Label htmlFor="imagePreview">Pré-visualização da Imagem</Label>
                            <img src={imagePreview} alt="Pré-visualização da Imagem" className="aspect-square h-64 w-64 object-cover" />
                        </div>
                    )}
                    {isEdit &&
                        !imagePreview &&
                        (person.data.image ? (
                            <div className="grid gap-2">
                                <Label htmlFor="name">Imagem atual</Label>
                                <img src={`${person.data.image?.path}`} alt={person.data.name} className="aspect-square h-64 w-64 object-cover" />
                                <InputError className="mt-2" message={errors.image} />
                            </div>
                        ) : (
                            <></>
                        ))}
                    <div className="flex justify-end">
                        <Button variant={'default'} type="submit" disabled={processing}>
                            {isEdit ? 'Salvar' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
