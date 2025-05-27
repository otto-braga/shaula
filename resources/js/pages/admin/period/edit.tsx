import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Period } from '@/types/period';
import { Head, Link, useForm } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { DeleteIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';

registerPlugin(FilePondPluginImagePreview);

export default function EditPeriodPage({ period }: { period: { data: Period } }) {
    const isEditing = !!period;

    console.log(period);

    const {
        data,
        setData,
        post,
        put: update,
        processing,
        reset,
        errors,
        // clearErrors,
    } = useForm({
        name: period ? period.data.name : '',
        // timespan: period ? period.timespan : '',
        start_date: period ? period.data.start_date : '',
        end_date: period ? period.data.end_date : '',
        content: period ? period.data.content : '',
        files: Array<File>(),
        deleteImage: false as boolean,
    });

    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (period) {
            update(route('periods.update', { period: period.data }), {
                preserveScroll: true,
                // onFinish: () => reset(),
            });
        } else {
            post(route('periods.store'), {
                preserveScroll: true,
                // onFinish: () => reset(),
            });
        }
    };

    function onContentInput() {
        setData('content', editorRef?.current?.getContent() ?? String());
    }

    // const breadcrumbs: BreadcrumbItem[] = [
    //     {
    //         title: 'Periodização',
    //         href: route('periods.index'),
    //     },
    //     {
    //         title: isEditing ? 'Editar Período' : 'Novo Período',
    //         href: isEditing ? route('periods.edit', { period: period }) : route('periods.create'),
    //     },
    // ];

    useEffect(() => {
        setData('files', images as File[]);
    }, [images]);

    const [deleteImage, setDeleteImage] = useState<boolean>(false);

    useEffect(() => {
        setData('deleteImage', deleteImage);
        // console.log('deleteImage', deleteImage);
    }, [deleteImage]);

    useEffect(() => {
        console.log(data);
        // console.log('deleteImage', deleteImage);
    }, [data]);

    return (
        <AppLayout>
            <Head title={isEditing ? `Editar: ${period?.data.name}` : 'Novo Período'} />
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <div>
                        <h1>{isEditing ? `Editar Período: ${period.data.name}` : 'Criar Novo Período'}</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nome do período"
                                    disabled={processing}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Data de início</Label>
                                    <Input
                                        id="start_date"
                                        type="text"
                                        name="start_date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        placeholder="Ex: Séc. XV, 1900, etc."
                                        disabled={processing}
                                        className={errors.start_date ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">Data final</Label>
                                    <Input
                                        id="end_date"
                                        type="text"
                                        name="end_date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        placeholder="Ex: Séc. XVI, 1950, etc."
                                        disabled={processing}
                                        className={errors.end_date ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div>
                                <FilePond
                                    files={images}
                                    onupdatefiles={(imageItems: FilePondFile[]) => {
                                        setImages(imageItems.map((imageItem) => imageItem.file as File));
                                    }}
                                    allowMultiple={false}
                                />

                                {period?.data.image?.path && (
                                    <div className="flex flex-row gap-2">
                                        <img
                                            src={period?.data.image?.path}
                                            alt={period?.data.image?.name}
                                            className="h-32 w-32 rounded-md object-cover"
                                        />
                                        <Button
                                            key={period?.data.image.id + 'delete_button'}
                                            type="button"
                                            className={deleteImage ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300'}
                                            onClick={() => {
                                                // deleteImage ? setDeleteImage(false) : setDeleteImage(true);
                                                setDeleteImage(deleteImage ? false : true);
                                            }}
                                        >
                                            <DeleteIcon /> Deletar
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="content-editor">Sobre</Label>
                                <Editor
                                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                                    licenseKey="gpl"
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    value={data.content} // Controlled component
                                    disabled={processing}
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
                                        min_height: 300,
                                        menubar: false,
                                        toolbar:
                                            'undo redo | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'link | removeformat | help',
                                        content_style:
                                            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 100%; height: auto; display: block; margin: auto; padding: 0.5rem;}',
                                        paste_preprocess: (_editor, args) => {
                                            const blob = args.content.match(/<img src="blob:.*">/g);
                                            if (blob) {
                                                args.content = '';
                                            }
                                        },
                                        paste_block_drop: true,
                                    }}
                                    onEditorChange={onContentInput}
                                    id="content-editor"
                                />
                                <InputError className="mt-2" message={errors.content} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col justify-end gap-3 pt-6 sm:flex-row">
                            <Link href={route('periods.index')} as="button" type="button" disabled={processing}>
                                <p>Cancelar</p>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? (isEditing ? 'Salvando...' : 'Criando...') : isEditing ? 'Salvar Alterações' : 'Criar Período'}
                            </Button>
                        </CardFooter>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
