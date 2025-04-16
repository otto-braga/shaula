import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Period } from '@/types/period';
import { useForm } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

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
        timespan: period ? period.timespan : '',
        about: period ? period.about : '',
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
        setData('about', editorRef?.current?.getContent() ?? String());
    }

    const editorRef = useRef<TinyMCEEditor | null>(null);

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
                        <Label htmlFor="timespan" className="">
                            Período de tempo
                        </Label>

                        <Input
                            id="timespan"
                            type="text"
                            name="timespan"
                            value={data.timespan}
                            onChange={(e) => setData('timespan', e.target.value)}
                            placeholder="Séc. XV - Séc. XVI"
                        />

                        <InputError message={errors.timespan} />
                    </div>

                    <div>
                        <Label htmlFor="name">Biografia</Label>
                        <Editor
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            licenseKey="gpl"
                            onInit={(_evt, editor) => (editorRef.current = editor)}
                            initialValue={(period?.about as string) || String()}
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
                        <InputError className="mt-2" message={errors.about} />
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
