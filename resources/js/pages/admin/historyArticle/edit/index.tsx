import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { HistoryArticle } from '@/types/historyArticle';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import EditTabs from '@/components/edit/edit-tabs';

export default function Index({
    historyArticle,
}: {
    historyArticle: { data: HistoryArticle };
}) {
    const isEdit = !!historyArticle;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: historyArticle ? historyArticle.data.title : '',
        date: historyArticle ? historyArticle.data.date : '',

        authors_ids: historyArticle ? historyArticle.data.authors.map((author) => author.id) : [] as number[],
        categories_ids: historyArticle ? historyArticle.data.categories?.map((category) => category.id) : [] as number[],
        periods_ids: historyArticle ? historyArticle.data.periods?.map((period) => period.id) : [] as number[],

        links: historyArticle ? historyArticle.data.links : String(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        if (isEdit) {
            post(route('history_articles.update', historyArticle.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('history_articles.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    const editorLinksRef = useRef<TinyMCEEditor | null>(null);

    function onLinksInput(e: any) {
        setData('links', editorLinksRef?.current?.getContent() ?? String());
    }

    return (
        <AppLayout>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <EditTabs
                                model={historyArticle}
                                route_base_name="history_articles"
                                processing={processing}
                            />

                            {isEdit}

                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="authors_ids">Autores</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        historyArticle?.data.authors?.map(
                                            author => ({ value: author.id, label: author.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'people.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('authors_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.authors_ids} />
                            </div>

                            <div className="flex flex-row gap-3">
                                <div className="w-full">
                                    <Label htmlFor="date">Data</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date ?? ''}
                                        onChange={(e) => setData('date', e.target.value)}
                                        autoComplete="date"
                                        className="w-full"
                                    />
                                    <InputError className="mt-2" message={errors.date} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        historyArticle?.data.categories?.map(
                                            category => ({ value: category.id, label: category.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'categories.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('categories_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.categories_ids} />
                            </div>

                            <div>
                                <Label htmlFor="periods">Periodização</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        historyArticle?.data.periods?.map(
                                            period => ({ value: period.id, label: period.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'periods.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('periods_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.periods_ids} />
                            </div>


                            <div>
                                <Label htmlFor="links">Links relacionados</Label>
                                <Editor
                                    tinymceScriptSrc='/tinymce/tinymce.min.js'
                                    licenseKey='gpl'
                                    onInit={(_evt, editor) => editorLinksRef.current = editor}
                                    initialValue={historyArticle?.data.links as string || String()}
                                    init={{
                                        plugins: [
                                            'autolink', 'lists', 'link',
                                            'autoresize',
                                        ],

                                        min_height: 150,
                                        autoresize_bottom_margin: 0,

                                        menubar: false,

                                        skin: document.documentElement.classList.contains('dark') ? "oxide-dark" : "oxide",
                                        content_css: document.documentElement.classList.contains('dark') ? "dark" : "default",

                                        toolbar: 'link | undo redo',

                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {max-width: 80%; display: block; margin: auto; padding: 1rem;}',
                                    }}
                                    onEditorChange={onLinksInput}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
