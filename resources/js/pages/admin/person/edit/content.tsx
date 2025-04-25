import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Person } from '@/types/person';
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

import { Button } from '@/components/ui/button';
import Modal from '@/components/common/modal';
import { CheckIcon, DeleteIcon, XIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pessoas',
        href: '/admin/pessoas',
    },
];

export default function Content({
    person,
}: {
    person: { data: Person }
}) {
    const { data, setData, post, errors, processing } = useForm({
        content: person.data.content as string ?? String(),
        files: Array<File>(),
        filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setImages([]);

        post(route('person.update.content', person.data), {
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
                            <Tabs person={person} processing={processing} className='sticky top-0 z-50 text-gray-800 bg-white dark:bg-black dark:text-gray-200' />

                            <div className='sticky top-96'>

                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue={person.data.content as string || String()}
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
                                    <FilePond
                                        files={images}
                                        onupdatefiles={(imageItems: FilePondFile[]) => {
                                            setImages(imageItems.map((imageItem) => imageItem.file as File))
                                        }}
                                        allowMultiple={true}
                                    />

                                    <div className="flex flex-row gap-2">
                                        {person.data.content_images.map((image, index) => (
                                            <div key={image.id} className='flex flex-col items-center'>
                                                <img key={image.id + 'image'} src={image.path} alt={image.path}
                                                    className={
                                                        'object-cover w-32 h-32 rounded-lg shadow-md'
                                                        + (imagesToRemove.find(id => id === image.id) ? ' opacity-50' : '')
                                                    }
                                                />
                                                <div className='w-full flex flex-col justify-between'>
                                                    <Button
                                                        key={image.id + 'select_button'}
                                                        type="button"
                                                        className={
                                                            ('bg-gray-100 hover:bg-blue-300')
                                                        }
                                                        onClick={
                                                            () => {
                                                                editorRef?.current?.execCommand(
                                                                    'mceInsertContent',
                                                                    false,
                                                                    `<img src="${image.path}" alt="${image.path}" />`
                                                                );
                                                                closeGallery();
                                                            }
                                                        }
                                                    >
                                                        <CheckIcon /> Adicionar ao texto
                                                    </Button>
                                                    <Button
                                                        key={image.id + 'delete_button'}
                                                        type="button"
                                                        className={
                                                            (imagesToRemove.find(id => id === image.id) ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                                                        }
                                                        onClick={
                                                            () => {
                                                                if (!imagesToRemove.find(id => id === image.id)) {
                                                                    setImagesToRemove([...imagesToRemove, image.id]);
                                                                } else {
                                                                    setImagesToRemove(imagesToRemove.filter((i) => i !== image.id));
                                                                }
                                                            }
                                                        }
                                                    >
                                                        <DeleteIcon /> Deletar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="ml-8 flex justify-center">
                                        <Button type="submit"
                                            onClick={submit}
                                            disabled={processing || isTimedMessageShown}
                                            className={
                                                'rounded min-w-[8em]' +
                                                (
                                                    isTimedMessageShown ?
                                                        (
                                                            flash?.success ?
                                                                ' bg-green-400'
                                                                : ' bg-red-400'
                                                        )
                                                        : (
                                                            ''
                                                        )
                                                )
                                            }
                                        >
                                            {
                                                processing ?
                                                    'Salvando...'
                                                    : isTimedMessageShown ?
                                                        (
                                                            flash?.success ?
                                                                (
                                                                    <div className="flex items-center gap-2">
                                                                        Salvo! <CheckIcon className="h-16 w-16" />
                                                                    </div>
                                                                )
                                                                : (
                                                                    <div className="flex items-center gap-2">
                                                                        Erro! <XIcon className="h-16 w-16" />
                                                                    </div>
                                                                )
                                                        )
                                                        : 'Salvar'
                                            }
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
