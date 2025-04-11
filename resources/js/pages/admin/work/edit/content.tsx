import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
import { Work } from '@/types/work';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import Tabs from './Tabs';

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile, FilePondInitialFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

import ImageCard from '@/components/image/image-card';
import { Button } from '@headlessui/react';
import Modal from '@/components/common/modal';
import ContentImageCard from '@/components/image/content-image-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

export default function Content({
    work,
}: {
    work: { data: Work }
}) {
    const { data, setData, post, errors, processing } = useForm({
        content: work.data.content as string ?? String(),
        files: Array<File>(),
        filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('work.update.content', work.data), {
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
                            <Tabs work={work} processing={processing} className='sticky top-0 z-50 bg-black text-gray-800 dark:text-gray-200' />

                            <div className='sticky top-96'>

                                {/* {usePage().props.errors.files && (
                                    <p className="text-red-500 text-xs italic">
                                        {usePage().props.errors.files}
                                    </p>
                                )}

                                {usePage().props.errors.content && (
                                    <p className="text-red-500 text-xs italic">
                                        {usePage().props.errors.content}
                                    </p>
                                )} */}

                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue={work.data.content as string || String()}
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
                                            work.data.content_images.map((image, index) => (
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