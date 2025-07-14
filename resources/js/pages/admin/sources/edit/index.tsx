import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Source } from '@/types/source';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';
import EditFile from '@/components/edit/edit-file';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { MultiValue } from 'react-select';
import { SearchResult } from '@/types/search-result';

export default function Index({
    source,
}: {
    source: { data: Source },
}) {
    const isEdit = !!source;

    const { data, setData, post, processing } = useForm({
        title: source ? source.data.title : String(),
        source_categories_uuids: source ? source.data.source_categories?.map((source_category) => source_category.uuid) : [] as string[],
        files: Array<File>(),
        delete_file: false as boolean,
        content: source ? source.data.content as string : String(),
    });
    const { errors } = usePage().props;

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
                                <Label htmlFor="source_categories_uuids">Categorias</Label>
                                <LazyLoadingSelectWithStates
                                    isMulti
                                    routeName={'source_categories.fetch.options'}
                                    value={source?.data.source_categories?.map(
                                        source_category => ({ uuid: source_category.uuid, label: source_category.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('source_categories_uuids', options.map((option) => option.uuid));
                                    }}
                                />
                                <InputError className="mt-2" message={errors.source_categories_uuids} />
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
