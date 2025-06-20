import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Artwork } from '@/types/artwork';
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

import Select from 'react-select';
import { SearchResultOption } from '@/types/search-result-option';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obra',
        href: route('artworks.index'),
    },
];

export default function Content({
    artwork,
}: {
    artwork: { data: Artwork }
}) {
    console.log('mentions', artwork.data.mentions);

    const { data, setData, post, errors, processing } = useForm({
        content: artwork.data.content as string ?? String(),
        files: Array<File>(),
        filesToRemove: Array<number>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setImages([]);

        post(route('artworks.update.content', artwork.data), {
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

    const [showMentions, setShowMentions] = useState<boolean>(false);

    async function fetchMentions(search: string): Promise<SearchResultOption[]> {
        if (search.length < 1) {
            return [];
        }

        let response;

        fetch(
            route('public.search.fetch.options') + '?q=' + encodeURIComponent(search) + '&type=people',
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            })
            .then((res) => res.json())
            .then((data) => {
                response = data as { options: SearchResultOption[] };
                console.log('response', response);
                setFetchedMentions(
                    response.options.map((object: SearchResultOption) => ({
                        value: object.value,
                        label: object.label,
                        type: object.type || '',
                    }))
                );
            });

        return response || [];
    }

    useEffect(() => {
        if (flash?.success != undefined && !isTimedMessageShown) {
            setIsTimedMessageShown(true);
            setTimeout(() => {
                setIsTimedMessageShown(false);
            }, timedMessageDuration);
        }
    }, [flash]);

    const [fetchedMentions, setFetchedMentions] = useState<SearchResultOption[]>([]);
    const [selectedMention, setSelectedMention] = useState<SearchResultOption | null>(null);

    const openMentionModal = () => {
        setShowMentions(true);
        setFetchedMentions([]);
        setSelectedMention(null);
        // set focus on the select input
        setTimeout(() => {
            const selectInput = document.querySelector('.react-select__input input');
            if (selectInput) {
                (selectInput as HTMLInputElement).focus();
            }
        }, 100);
    }

    const closeMentionModal = () => {
        if (!selectedMention) {
            editorRef?.current?.execCommand(
                'mceInsertContent',
                false,
                '@'
            );
            editorRef?.current?.focus();
        }
        setShowMentions(false);
        setSelectedMention(null);
        setFetchedMentions([]);
    }

    useEffect(() => {
        console.log('fetchedMentions', fetchedMentions);
    }, [fetchedMentions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} className='sticky top-0 z-50 text-gray-800 bg-white dark:bg-black dark:text-gray-200' />

                            <div className='sticky top-96'>

                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorRef.current = editor}
                                    initialValue={artwork.data.content as string || String()}
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

                                            // Handle @ mentions
                                            editor.on('keydown', (e) => {
                                                if (e.key === '@') {
                                                    e.preventDefault();
                                                    // setShowMentions(true);
                                                    openMentionModal();
                                                }
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
                                        {artwork.data.content_images.map((image, index) => (
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

                            <Modal show={showMentions} onClose={closeMentionModal}>
                                <div className="p-4 h-100">
                                    <h2 className="text-lg font-semibold mb-4">Mencionar</h2>
                                    <p className="mb-2">Digite o nome da entrada que deseja mencionar:</p>
                                    <Select
                                        options={fetchedMentions}
                                        value={selectedMention}
                                        onChange={(option) => {
                                            if (option) {
                                                option = fetchedMentions.find((mention) => mention.value === option?.value) || option;
                                                editorRef?.current?.execCommand(
                                                    'mceInsertContent',
                                                    false,
                                                    `<span class="shaula-mention"><a href="${route('public.search.redirect_mention')}?key=${option.value}&type=${option.type}">${option.label}</a></span>`
                                                );
                                                setSelectedMention(null);
                                                setShowMentions(false);
                                            }
                                        }}
                                        onInputChange={(inputValue) => {
                                            fetchMentions(inputValue);
                                        }}
                                        placeholder="Digite para buscar..."
                                        isClearable
                                        className="mb-4"
                                    />
                                    <p className="mt-4 text-sm text-gray-500">Pressione "Enter" para inserir a menção.</p>
                                </div>
                            </Modal>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
