import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Source } from '@/types/source';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';
import EditFile from '@/components/edit/edit-file';

export default function Index({
    source,
}: {
    source: { data: Source },
}) {
    const isEdit = !!source;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: source ? source.data.title : String(),
        source_categories_ids: source ? source.data.source_categories?.map((source_category) => source_category.id) : [] as number[],
        files: Array<File>(),
        delete_file: false as boolean,
        content: source ? source.data.content as string : String(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        if (isEdit) {
            post(route('sources.update', source.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('sources.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <EditTabs
                                model={source}
                                route_base_name="sources"
                                processing={processing}
                            />

                            {isEdit}

                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={data.title ?? ''} onChange={(e) => setData('title', e.target.value)} autoComplete="title" />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        source?.data.source_categories?.map(
                                            category => ({ value: category.id, label: category.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'source_categories.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('source_categories_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.source_categories_ids} />
                            </div>

                            <EditFile
                                stored_file={source?.data.file}
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                            />

                            <HtmlEditor
                                content={source?.data.content ?? ''}
                                content_images={[]}
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                hasGallery={false}
                                hasMentions={false}
                            />

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
