import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import Tabs from './tabs';

// import { FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { registerPlugin } from 'react-filepond';
registerPlugin(FilePondPluginImagePreview);

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: '/admin/pessoas',
    },
];

export default function Content({ person }: { person: { data: Person } }) {
    const { data, setData, post, errors, processing } = useForm({
        content: (person.data.content as string) ?? String(),
        cronology: (person.data.cronology as string) ?? String(),
        // files: Array<File>(),
        // filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // setImages([]);

        post(route('people.update.content', person.data), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    // useEffect(() => {
    //     setData('files', images as File[]);
    //     console.log('images', images);
    // }, [images]);

    const editorRef = useRef<TinyMCEEditor | null>(null);
    const editorRef2 = useRef<TinyMCEEditor | null>(null);

    function onContentInput(e: any) {
        setData('content', editorRef?.current?.getContent() ?? String());
    }

    function onCronologyInput(e: any) {
        setData('cronology', editorRef2?.current?.getContent() ?? String());
    }

    const { flash } = usePage().props;

    const timedMessageDuration: number = 3000;
    const [isTimedMessageShown, setIsTimedMessageShown] = useState<boolean>(false);

    useEffect(() => {
        if (flash?.success != undefined && !isTimedMessageShown) {
            setIsTimedMessageShown(true);
            setTimeout(() => {
                setIsTimedMessageShown(false);
            }, timedMessageDuration);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs
                                person={person}
                                processing={processing}
                                className="sticky top-0 z-50 bg-white text-gray-800 dark:bg-black dark:text-gray-200"
                            />

                            <div className="max-w-3xl space-y-6">
                                <div>
                                    <Label htmlFor="content">Biografia</Label>
                                    <Editor
                                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                                        licenseKey="gpl"
                                        onInit={(_evt, editor) => (editorRef.current = editor)}
                                        initialValue={(person.data.content as string) || String()}
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

                                            toolbar_sticky: false,
                                            // toolbar_sticky_offset: 100,

                                            min_height: 500,
                                            autoresize_bottom_margin: 0,

                                            menubar: false,

                                            skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
                                            content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',

                                            toolbar:
                                                'undo redo | ' +
                                                // 'gallery | ' +
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
                                </div>

                                <div>
                                    <Label htmlFor="cronology">Cronologia</Label>
                                    <Editor
                                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                                        licenseKey="gpl"
                                        onInit={(_evt, editor) => (editorRef2.current = editor)}
                                        initialValue={(person.data.cronology as string) || String()}
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

                                            toolbar_sticky: false,
                                            // toolbar_sticky_offset: 100,

                                            min_height: 500,
                                            autoresize_bottom_margin: 0,

                                            menubar: false,

                                            skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
                                            content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',

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
                                        onEditorChange={onCronologyInput}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
