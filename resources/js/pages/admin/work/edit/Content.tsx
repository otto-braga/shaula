import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import Tabs from './Tabs';

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondFile, FilePondInitialFile } from 'filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import ImageCard from '@/Components/ImageCard';

export default function Content({
    work,
}: PageProps<{
    work: { data: Work }
}>) {
    const { data, setData, post, errors, processing } = useForm({
        content: work.data.content as string ?? String(),
        files: Array<File>(),
        filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('work.update.content', work.data.uuid), {
            preserveScroll: true,
            preserveState: false,
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

                            <div className='sticky top-96'>

                                {usePage().props.errors.files && (
                                    <p className="text-red-500 text-xs italic">
                                        {usePage().props.errors.files}
                                    </p>
                                )}

                                {usePage().props.errors.content && (
                                    <p className="text-red-500 text-xs italic">
                                        {usePage().props.errors.content}
                                    </p>
                                )}

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
                                                <ImageCard
                                                    key={index}
                                                    image={image}
                                                    toRemove={imagesToRemove.includes(image.id)}
                                                    onSelected={() => {
                                                        editorRef?.current?.execCommand(
                                                            'mceInsertContent',
                                                            false,
                                                            `<img src="${image.path}" alt="${image.path}" />`
                                                        );
                                                        closeGallery();
                                                    }}
                                                    onRemove={(remove) => {
                                                        if (remove) {
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

                                    <div className='flex justify-end ml-8'>
                                        <PrimaryButton type="submit" disabled={processing} onClick={submit}>
                                            Salvar
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </Modal>

                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}