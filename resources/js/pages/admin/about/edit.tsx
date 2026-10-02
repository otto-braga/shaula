import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { About } from '@/types/about';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { FilePondFile } from 'filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { Check, ExternalLink, Image as ImageIcon, Loader2, Save, Trash2, Undo2 } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Editor as TinyMCEEditor } from 'tinymce';

registerPlugin(FilePondPluginImagePreview);

interface EditAboutProps {
    about: { data: About } | About;
}

export default function EditAbout({ about }: EditAboutProps) {
    const aboutData = 'data' in about ? about.data : about;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        title: aboutData?.title || 'Sobre o Shaula',
        content: aboutData?.content || '',
        cover_image: null as File | null,
        remove_cover_image: false,
        _method: 'PUT',
    });

    const { flash } = usePage().props as { flash?: { success?: boolean } };
    const [pondFiles, setPondFiles] = useState<any[]>([]);
    const [previewNewCover, setPreviewNewCover] = useState<string | null>(null);
    const [isCoverMarkedForRemoval, setIsCoverMarkedForRemoval] = useState<boolean>(false);
    const editorRef = useRef<TinyMCEEditor | null>(null);

    // Track removal toggle
    const handleRemoveCurrentCover = () => {
        setIsCoverMarkedForRemoval(true);
        setData('remove_cover_image', true);
    };

    const handleRestoreCurrentCover = () => {
        setIsCoverMarkedForRemoval(false);
        setData('remove_cover_image', false);
    };

    const handleFilePondUpdate = (fileItems: FilePondFile[]) => {
        setPondFiles(fileItems);
        if (fileItems.length > 0 && fileItems[0].file instanceof File) {
            const file = fileItems[0].file as File;
            setData('cover_image', file);
            setPreviewNewCover(URL.createObjectURL(file));
        } else {
            setData('cover_image', null);
            setPreviewNewCover(null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Ensure latest content from TinyMCE is synced
        if (editorRef.current) {
            data.content = editorRef.current.getContent();
        }

        post(route('about.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setPondFiles([]);
                setPreviewNewCover(null);
                setIsCoverMarkedForRemoval(false);
            },
        });
    };

    const hasStoredCover = !!aboutData?.cover_image?.path;

    return (
        <AppLayout>
            <Head title="Editar Página Sobre" />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="border-border flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">Página Institucional</span>
                            <span className="text-muted-foreground text-xs">/admin/sobre</span>
                        </div>
                        <h1 className="text-foreground mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Editar Página Sobre</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Personalize o conteúdo da página institucional (/sobre) e a imagem de destaque da capa.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild>
                            <a href={route('public.about')} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                                <ExternalLink className="size-4" />
                                <span>Ver Página Pública</span>
                            </a>
                        </Button>

                        <Button onClick={submit} disabled={processing} className="flex items-center gap-2">
                            {processing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Salvando...</span>
                                </>
                            ) : recentlySuccessful || flash?.success ? (
                                <>
                                    <Check className="size-4 text-green-400" />
                                    <span>Salvo com sucesso!</span>
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    <span>Salvar Alterações</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Status messages */}
                {(recentlySuccessful || flash?.success) && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
                        <Check className="size-5 shrink-0 text-green-600 dark:text-green-400" />
                        <span>As alterações na página Sobre foram salvas com sucesso e já estão visíveis publicamente.</span>
                    </div>
                )}

                {(errors as Record<string, string | undefined>).error && (
                    <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
                        {(errors as Record<string, string | undefined>).error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    {/* Cover Image Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon className="text-primary size-5" />
                                Imagem de Capa (Hero)
                            </CardTitle>
                            <CardDescription>
                                Esta imagem será exibida com destaque no topo da página /sobre. Proporções recomendadas: 16:9 ou 21:9 em alta
                                resolução.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Current Image Display */}
                            {hasStoredCover && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Capa Atual</Label>
                                    <div className="border-border bg-muted/40 relative overflow-hidden rounded-lg border p-2">
                                        <div
                                            className={`relative h-48 w-full overflow-hidden rounded-md sm:h-64 ${
                                                isCoverMarkedForRemoval ? 'opacity-40 grayscale filter' : ''
                                            }`}
                                        >
                                            <img
                                                src={aboutData.cover_image?.path}
                                                alt="Imagem de Capa Atual"
                                                className="h-full w-full object-cover object-center"
                                            />
                                            {isCoverMarkedForRemoval && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                                                    Marcada para exclusão ao salvar
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between px-1">
                                            <span className="text-muted-foreground text-xs">
                                                {aboutData.cover_image?.original_name || 'cover-image.jpg'}
                                            </span>

                                            {isCoverMarkedForRemoval ? (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleRestoreCurrentCover}
                                                    className="flex items-center gap-1.5 text-xs"
                                                >
                                                    <Undo2 className="size-3.5" />
                                                    Desfazer Remoção
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleRemoveCurrentCover}
                                                    className="flex items-center gap-1.5 text-xs"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Remover Capa
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upload New Image */}
                            <div className="space-y-2">
                                <Label htmlFor="cover_image_upload">
                                    {hasStoredCover && !isCoverMarkedForRemoval ? 'Substituir Imagem de Capa' : 'Carregar Imagem de Capa'}
                                </Label>
                                <FilePond
                                    files={pondFiles}
                                    onupdatefiles={handleFilePondUpdate}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    name="cover_image"
                                    labelIdle='Arraste a nova imagem ou <span class="filepond--label-action">clique para selecionar</span>'
                                    acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                                />
                                <InputError message={errors.cover_image} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Texto Institucional</CardTitle>
                            <CardDescription>
                                Escreva e formate a história, objetivos, créditos e demais informações do projeto com o editor rico TinyMCE.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título da Página</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Ex: Sobre o Shaula"
                                    className="max-w-lg"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Conteúdo Rico</Label>
                                <div className="border-input overflow-hidden rounded-md border">
                                    <Editor
                                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                                        licenseKey="gpl"
                                        onInit={(_evt, editor) => (editorRef.current = editor)}
                                        initialValue={data.content || ''}
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
                                            min_height: 480,
                                            autoresize_bottom_margin: 0,
                                            menubar: false,
                                            skin: document.documentElement.classList.contains('dark') ? 'oxide-dark' : 'oxide',
                                            content_css: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
                                            toolbar:
                                                'undo redo | blocks fontfamily fontsize | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table media | removeformat code fullscreen',
                                            link_title: false,
                                            link_default_target: '_blank',
                                            link_target_list: false,
                                            content_style:
                                                'body { font-family:Instrument Sans,Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.7; padding: 1rem; } p { margin-bottom: 1rem; } h1, h2, h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; } a { color: #0284c7; text-decoration: underline; } blockquote { border-left: 3px solid #cbd5e1; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; }',
                                        }}
                                        onEditorChange={(newContent) => setData('content', newContent)}
                                    />
                                </div>
                                <InputError message={errors.content} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Save Action */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" asChild>
                            <Link href={route('dashboard')}>Cancelar</Link>
                        </Button>

                        <Button type="submit" disabled={processing} className="flex min-w-36 items-center gap-2">
                            {processing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    <span>Salvar Alterações</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
