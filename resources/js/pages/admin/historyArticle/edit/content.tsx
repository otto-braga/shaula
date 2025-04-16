import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { HistoryArticle } from '@/types/history-article';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import Tabs from './tabs';

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile, FilePondInitialFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { Button } from '@headlessui/react';
import Modal from '@/components/common/modal';
import ContentImageCard from '@/components/image/content-image-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Críticas',
        href: '/admin/historyArticle',
    },
];

export default function Content({
    historyArticle,
}: {
    historyArticle: { data: HistoryArticle }
}) {
    const { data, setData, post, errors, processing } = useForm({
        content: historyArticle.data.content as string ?? String(),
        files: Array<File>(),
        filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('historyArticle.update.content', historyArticle.data), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', images as File[]);
        console.log('images', images);
    }, [images]);

    const editorRef = useRef<TinyMCEEditor | null>(null);

    function onContentInput(e: any) {
        setData('content', editorRef?.current?.getContent() ?? String());
    }

    const [showGallery, setShowGallery] = useState(false);

    function closeGallery() {
        setShowGallery(false);
    }

    const [imagesToRemove, setImagesToRemove] = useState<Array<number>>([]);

    useEffect(() => {
        console.log('imagesToRemove', imagesToRemove);
        setData('filesToRemove', imagesToRemove);
    }, [imagesToRemove]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs historyArticle={historyArticle} processing={processing} className='sticky top-0 z-50 text-gray-800 bg-white dark:bg-black dark:text-gray-200' />

                            <div className='sticky top-96'>

                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue={historyArticle.data.content as string || String()}
                                    init={{
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                                            'autoresize',
                                        ],

                                        toolbar_sticky: true,
                                        toolbar_sticky_offset: 100,

                                        min_height: 500,
                                        autoresize_bottom_margin: 0,

                                        menubar: false,

                                        skin: document.documentElement.classList.contains('dark') ? "oxide-dark" : "oxide",
                                        content_css: document.documentElement.classList.contains('dark') ? "dark" : "default",

                                        toolbar: 'undo redo | ' +
                                            'gallery | ' +
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

                                        setup: (editor) => {

                                            editor.ui.registry.addButton('gallery', {
                                                text: 'Galeria',
                                                onAction: () => {
                                                    setShowGallery(true);
                                                },
                                            });
                                        },
                                    }}
                                    onEditorChange={onContentInput}
                                />

                            </div>

                            <Modal show={showGallery} onClose={closeGallery}>
                                <div>
                                    <div className='flex flex-row gap-2'>
                                        {
                                            historyArticle.data.content_images.map((image, index) => (
                                                <ContentImageCard
                                                    key={index}
                                                    image={image}
                                                    onSelectedChange={() => {
                                                        editorRef?.current?.execCommand(
                                                            'mceInsertContent',
                                                            false,
                                                            `<img src="${image.path}" alt="${image.path}" />`
                                                        );
                                                        closeGallery();
                                                    }}
                                                    onRemoveChange={(isToRemove) => {
                                                        if (isToRemove) {
                                                            setImagesToRemove([...imagesToRemove, image.id]);
                                                        } else {
                                                            setImagesToRemove(imagesToRemove.filter((i) => i !== image.id));
                                                        }
                                                    }}
                                                />
                                            ))
                                        }
                                    </div>

                                    <FilePond
                                        files={images}
                                        onupdatefiles={(imageItems: FilePondFile[]) => {
                                            setImages(imageItems.map((imageItem) => imageItem.file as File))
                                        }}
                                        allowMultiple={true}
                                    />

                                    <div className='flex justify-center ml-8'>
                                        <Button type="submit" disabled={processing} onClick={submit}
                                            className='bg-gray-300 hover:bg-blue-300 text-black font-bold py-2 px-4 rounded'>
                                            Salvar
                                        </Button>
                                    </div>
                                </div>
                            </Modal>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}