import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Source } from '@/types/source';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import Tabs from './tabs';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import { Button } from '@/components/ui/button';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { CheckIcon, DeleteIcon } from 'lucide-react';
registerPlugin(FilePondPluginImagePreview);

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { FileCard } from '@/components/ui/file-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fontes',
        href: '/admin/source',
    },
];

export default function Index({
    source,
}: {
    source: { data: Source },
}) {
    const isEdit = !!source;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: source ? source.data.title : String(),
        source_categories_ids: source ? source.data.source_categories?.map((source_category) => source_category.id) : [] as number[],
        files: Array<File>(),
        delete_file: false as boolean,
        content: source ? source.data.content as string : String(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        if (isEdit) {
            post(route('sources.update', source.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('sources.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', files as File[]);
    }, [files]);

    const [deleteFile, setDeleteFile] = useState<boolean>(false);

    useEffect(() => {
        setData('delete_file', deleteFile);
    }, [deleteFile]);

    const editorRef = useRef<TinyMCEEditor | null>(null);

    function onContentInput(e: any) {
        setData('content', editorRef?.current?.getContent() ?? String());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs source={source} processing={processing} />
                            {isEdit}

                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={source?.data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        source?.data.source_categories?.map(
                                            category => ({ value: category.id, label: category.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'source_categories.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('source_categories_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.source_categories_ids} />
                            </div>

                            <Editor
                                tinymceScriptSrc='/tinymce/tinymce.min.js'
                                licenseKey='gpl'
                                onInit={(_evt, editor) => editorRef.current = editor}
                                initialValue={source?.data.content as string || String()}
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
                                onEditorChange={onContentInput}
                            />

                            <FilePond
                                files={files}
                                onupdatefiles={(imageItems: FilePondFile[]) => {
                                    setFiles(imageItems.map((imageItem) => imageItem.file as File));
                                }}
                                allowMultiple={false}
                            />

                            {source?.data.file?.path && (
                                <div className="flex flex-row gap-2">
                                    <FileCard
                                        file={source.data.file ?? null}
                                        className="w-full h-96"
                                    />
                                    <Button
                                        key={source?.data.file.id + 'delete_button'}
                                        type="button"
                                        className={
                                            (deleteFile ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                                        }
                                        onClick={() => { deleteFile ? setDeleteFile(false) : setDeleteFile(true); }}
                                    >
                                        <DeleteIcon /> Deletar
                                    </Button>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
