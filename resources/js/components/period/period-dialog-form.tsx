import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Period } from '@/types/period';
import { useForm } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { FilePondFile, FilePondInitialFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { CheckIcon, DeleteIcon } from 'lucide-react';
registerPlugin(FilePondPluginImagePreview);

interface PeriodDialogFormProps {
    period?: Period;
}

export default function PeriodDialogForm({ period }: PeriodDialogFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put: update,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        name: period ? period.name : '',
        // timespan: period ? period.timespan : '',
        start_date: period ? period.start_date : '',
        end_date: period ? period.end_date : '',
        content: period ? period.content : '',
        files: Array<File>(),
        deleteImage: false as boolean,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (period) {
            update(route('periods.update', period.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        } else {
            post(route('periods.store'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => reset(),
            });
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    function onContentInput() {
        setData('content', editorRef?.current?.getContent() ?? String());
    }

    const editorRef = useRef<TinyMCEEditor | null>(null);

    const [images, setImages] = useState<Array<FilePondInitialFile | File | Blob | string>>([]);

    useEffect(() => {
        setData('files', images as File[]);
    }, [images]);

    const [deleteImage, setDeleteImage] = useState<boolean>(false);

    useEffect(() => {
        setData('deleteImage', deleteImage);
        console.log('deleteImage', deleteImage);
    }, [deleteImage]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={`${period ? 'secondary' : 'default'}`} onClick={openModal}>
                    <div className="flex items-center">
                        {!period ? (
                            <>
                                <Plus size={16} />
                                <span>Período histórico</span>
                            </>
                        ) : (
                            <span>Editar</span>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{period ? 'Editar Tag' : 'Criar Tag'}</DialogTitle>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="">
                            Nome
                        </Label>

                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nome"
                        />

                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="start_date" className="">
                            Data de início
                        </Label>

                        <Input
                            id="start_date"
                            type="text"
                            name="start_date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            placeholder="Séc. XV - Séc. XVI"
                        />

                        <InputError message={errors.start_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="end_date" className="">
                            Data final
                        </Label>

                        <Input
                            id="end_date"
                            type="text"
                            name="end_date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            placeholder="Séc. XV - Séc. XVI"
                        />

                        <InputError message={errors.end_date} />
                    </div>

                    <FilePond
                        files={images}
                        onupdatefiles={(imageItems: FilePondFile[]) => {
                            setImages(imageItems.map((imageItem) => imageItem.file as File));
                        }}
                        allowMultiple={false}
                    />

                    {period?.image?.path && (
                        <div className="flex flex-row gap-2">
                            <img
                                src={period?.image?.path}
                                alt={period?.image?.name}
                                className="w-32 h-32 object-cover rounded-md"
                            />
                            <Button
                                key={period?.image.id + 'delete_button'}
                                type="button"
                                className={
                                    (deleteImage ? 'bg-red-600 hover:bg-red-300' : 'bg-gray-100 hover:bg-red-300')
                                }
                                onClick={() => { deleteImage ? setDeleteImage(false) : setDeleteImage(true); }}
                            >
                                <DeleteIcon /> Deletar
                            </Button>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="name">Sobre</Label>
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            licenseKey="gpl"
                            onInit={(_evt, editor) => (editorRef.current = editor)}
                            initialValue={(period?.content as string) || String()}
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

                                min_height: 300,
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
                        <InputError className="mt-2" message={errors.content} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button variant="default" disabled={processing} asChild>
                            <button type="submit">{period ? 'Salvar' : 'Criar'}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
