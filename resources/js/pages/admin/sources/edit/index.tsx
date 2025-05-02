import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Source } from '@/types/source';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Tabs from './tabs';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obras',
        href: '/admin/source',
    },
];

export default function Index({
    source,
}: {
    source: { data: Source },
}) {
    const isEdit = !!source;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: source ? source.data.title : '' as string,
        date: source ? source.data.date : '' as string,

        authors_ids: source ? source.data.authors.map((author) => author.id) : [] as number[],
        languages_ids: source ? source.data.languages?.map((language) => language.id) : [] as number[],
        awards_ids: source ? source.data.awards?.map((award) => award.id) : [] as number[],
        categories_ids: source ? source.data.categories?.map((category) => category.id) : [] as number[],
        periods_ids: source ? source.data.periods?.map((period) => period.id) : [] as number[],

        dimensions: source ? source.data.dimensions : '',
        materials: source ? source.data.materials : '',
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-3 bg-inherit">
                            <Tabs source={source} processing={processing} />
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
                                        source?.data.authors?.map(
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
                                        source?.data.categories?.map(
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
                                <Label htmlFor="periods">Períodos</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        source?.data.periods?.map(
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

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
