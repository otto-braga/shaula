import { usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
registerPlugin(FilePondPluginImagePreview);

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

import Modal from '@/components/common/modal';
import { Button } from '@/components/ui/button';
import { CheckIcon, DeleteIcon, XIcon } from 'lucide-react';

import { SearchResult } from '@/types/search-result';
import { LazyLoadingSelect } from '../select/lazy-loading-select';

type HtmlEditorProps = {
    className?: string;
    toolbar_sticky?: boolean;
    toolbar_sticky_offset?: number;
    content: string;
    content_images: { uuid: string; path: string }[];
    data: {
        content: string;
        files?: File[];
        files_to_remove?: string[];
    };
    setData: (key: string, value: any) => void;
    errors?: Record<string, string>;
    processing?: boolean;
    submit: FormEventHandler;

    hasGallery?: boolean;
    hasMentions?: boolean;
    hasImageUpload?: boolean;
};

export default function HtmlEditor({
    className = '',
    toolbar_sticky = false,
    toolbar_sticky_offset = 116,
    content,
    content_images,
    data,
    setData,
    errors,
    processing,
    submit,

    hasGallery = true,
    hasMentions = true,
}: HtmlEditorProps) {
    const toolbar =
        'undo redo | ' +
        (hasGallery ? 'gallery | ' : '') +
        'media | ' +
        (hasMentions ? 'mentions | ' : '') +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify |  outdent indent | ' +
        'removeformat';

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

    const [imagesToRemove, setImagesToRemove] = useState<Array<string>>([]);

    useEffect(() => {
        console.log('imagesToRemove', imagesToRemove);
        setData('filesToRemove', imagesToRemove);
    }, [imagesToRemove]);

    const { flash } = usePage().props as { error?: boolean, flash?: { success?: boolean } };

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

    async function fetchMentions(search: string): Promise<SearchResult[]> {
        if (search.length < 1) {
            return [];
        }

        let response;

        fetch(route('mentions.fetch.options') + '?q=' + encodeURIComponent(search), {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                response = data as { results: SearchResult[] };
                setFetchedMentions(
                    response.results.map((object: SearchResult) => ({
                        type: object.type || '',
                        uuid: object.uuid || '',
                        route: object.route || '',
                        label: object.label || '',
                    })),
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

    const [fetchedMentions, setFetchedMentions] = useState<SearchResult[]>([]);
    const [selectedMention, setSelectedMention] = useState<SearchResult | null>(null);
    const [shouldAddCharacter, setShouldAddCharacter] = useState<boolean>(true);

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
    };

    const closeMentionModal = () => {
        if (!selectedMention && shouldAddCharacter) {
            editorRef?.current?.execCommand('mceInsertContent', false, '@');
            editorRef?.current?.focus();
        }
        setShouldAddCharacter(false);
        setShowMentions(false);
        setSelectedMention(null);
        setFetchedMentions([]);
    };

    useEffect(() => {
        console.log('fetchedMentions', fetchedMentions);
    }, [fetchedMentions]);

    return (
        <>
            <div className={className}>
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    initialValue={(content as string) || String()}
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

                        toolbar_sticky: toolbar_sticky,
                        toolbar_sticky_offset: toolbar_sticky_offset,

                        min_height: 500,
                        autoresize_bottom_margin: 0,

                        menubar: false,

                        skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
                        content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',

                        toolbar: toolbar,

                        content_style:
                            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',

                        paste_preprocess: (editor, args) => {
                            const blob = args.content.match(/<img src="blob:.*">/g);

                            if (blob) {
                                args.content = '';
                            }
                        },

                        paste_block_drop: true,

                        setup: (editor) => {
                            if (hasGallery) {
                                editor.ui.registry.addButton('gallery', {
                                    text: 'Imagens',
                                    onAction: () => {
                                        setShowGallery(true);
                                    },
                                });
                            }

                            // Handle @ mentions
                            if (hasMentions) {
                                editor.ui.registry.addButton('mentions', {
                                    text: 'Mencionar',
                                    onAction: () => {
                                        setShouldAddCharacter(false);
                                        openMentionModal();
                                    },
                                });

                                editor.on('keydown', (e) => {
                                    if (e.key === '@') {
                                        e.preventDefault();
                                        setShouldAddCharacter(true);
                                        openMentionModal();
                                    }
                                });
                            }
                        },
                    }}
                    onEditorChange={onContentInput}
                />
            </div>

            <Modal show={showGallery} onClose={closeGallery}>
                <div className="p-4">
                    <div className="mb-4 flex justify-between gap-2">
                        <h1 className="text-lg font-semibold">Galeria do texto</h1>
                        <div className="flex-1"/>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeGallery}
                        >
                            Fechar
                        </Button>
                        <Button
                            type="submit"
                            onClick={(e) => {
                                setImages([]);
                                submit(e);
                            }}
                            disabled={processing || isTimedMessageShown}
                            className={(isTimedMessageShown ? (flash?.success ? ' bg-green-400' : ' bg-red-400') : '')}
                        >
                            {processing ? (
                                'Salvando...'
                            ) : isTimedMessageShown ? (
                                flash?.success ? (
                                    <div className="flex items-center gap-2">
                                        Salvo! <CheckIcon className="h-16 w-16" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Erro! <XIcon className="h-16 w-16" />
                                    </div>
                                )
                            ) : (
                                'Aplicar'
                            )}
                        </Button>
                    </div>

                    <FilePond
                        files={images}
                        onupdatefiles={(imageItems: FilePondFile[]) => {
                            setImages(imageItems.map((imageItem) => imageItem.file as File));
                        }}
                        allowMultiple={true}
                        labelIdle='Arraste e solte arquivos aqui ou <span class="filepond--label-action">clique para selecionar</span>.'
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {content_images.map((image, index) => (
                            <div key={image.uuid} className="flex flex-col items-center">
                                <img
                                    key={image.uuid + 'image'}
                                    src={image.path}
                                    alt={image.path}
                                    className={
                                        'h-32 rounded-lg object-cover shadow-md' +
                                        (imagesToRemove.find((uuid) => uuid === image.uuid) ? ' opacity-50' : '')
                                    }
                                />
                                <div className="flex w-full flex-col justify-between">
                                    <Button
                                        key={image.uuid + 'select_button'}
                                        type="button"
                                        variant={'secondary'}
                                        className='text-sm'
                                        onClick={() => {
                                            editorRef?.current?.execCommand(
                                                'mceInsertContent',
                                                false,
                                                `<img src="${image.path}" alt="${image.path}" />`,
                                            );
                                            closeGallery();
                                        }}
                                    >
                                        Adic. ao texto
                                    </Button>
                                    <Button
                                        key={image.uuid + 'delete_button'}
                                        type="button"
                                        variant={'secondary'}
                                        className={
                                            imagesToRemove.find((uuid) => uuid === image.uuid)
                                                ? 'bg-red-600 text-primary hover:bg-red-500'
                                                : 'bg-secondary hover:bg-red-500'
                                        }
                                        onClick={() => {
                                            if (!imagesToRemove.find((uuid) => uuid === image.uuid)) {
                                                setImagesToRemove([...imagesToRemove, image.uuid]);
                                            } else {
                                                setImagesToRemove(imagesToRemove.filter((i) => i !== image.uuid));
                                            }
                                        }}
                                    >
                                        <DeleteIcon /> Deletar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal show={showMentions} onClose={closeMentionModal}>
                <div className="h-150 p-4 z-50">
                    <h2 className="mb-4 text-lg font-semibold">Mencionar</h2>
                    <p className="mb-2">Digite o nome da entrada que deseja mencionar:</p>
                    <LazyLoadingSelect
                        options={fetchedMentions}
                        value={selectedMention}
                        onChange={(option: SearchResult) => {
                            if (option) {
                                option = fetchedMentions.find((mention) => mention.uuid === option?.uuid) || option;
                                editorRef?.current?.execCommand(
                                    'mceInsertContent',
                                    false,
                                    `<span class="shaula-mention"><a data-type="${option.type}" data-key="${option.uuid}" href="${option.route}">${option.label}</a></span>`,
                                );
                                setSelectedMention(null);
                                setShowMentions(false);
                            }
                        }}
                        onInputChange={(inputValue: string) => {
                            fetchMentions(inputValue);
                        }}
                    />
                    <p className="mt-4 text-sm text-gray-500">Pressione "Enter" para inserir a menção.</p>
                </div>
            </Modal>
        </>
    );
}
