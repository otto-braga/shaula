import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import EditTabs from '@/components/edit/edit-tabs';

export default function Index({
    artwork,
}: {
    artwork: { data: Artwork },
}) {
    const isEdit = !!artwork;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: artwork ? artwork.data.title : '' as string,
        date: artwork ? artwork.data.date : '' as string,

        authors_ids: artwork ? artwork.data.authors.map((author) => author.id) : [] as number[],
        languages_ids: artwork ? artwork.data.languages?.map((language) => language.id) : [] as number[],
        awards_ids: artwork ? artwork.data.awards?.map((award) => award.id) : [] as number[],
        categories_ids: artwork ? artwork.data.categories?.map((category) => category.id) : [] as number[],
        periods_ids: artwork ? artwork.data.periods?.map((period) => period.id) : [] as number[],

        dimensions: artwork ? artwork.data.dimensions : '',
        materials: artwork ? artwork.data.materials : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log('data', data);

        if (isEdit) {
            post(route('artworks.update', artwork.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('artworks.store'), {
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
                                model={artwork}
                                route_base_name="artworks"
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
                                        artwork?.data.authors?.map(
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
                                <Label htmlFor="dimensions">Dimensões</Label>
                                <Input
                                    id="title"
                                    value={data.dimensions ?? ''}
                                    onChange={(e) => setData('dimensions', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.dimensions} />
                            </div>

                            <div>
                                <Label htmlFor="materials">Materiais</Label>
                                <Input
                                    id="materials"
                                    value={data.materials ?? ''}
                                    onChange={(e) => setData('materials', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.materials} />
                            </div>

                            <div>
                                <Label htmlFor="languages">Linguagens</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        artwork?.data.languages?.map(
                                            language => ({ value: language.id, label: language.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'languages.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('languages_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.languages_ids} />
                            </div>

                            <div>
                                <Label htmlFor="awards">Prêmios</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        artwork?.data.awards?.map(
                                            award => ({ value: award.id, label: award.name })
                                        ) ?? []
                                    }
                                    routeName={
                                        'awards.fetch.options'
                                    }
                                    setterFunction={
                                        (options) => {
                                            setData('awards_ids', options.map((option) => (option.value)));
                                        }
                                    }
                                />
                                <InputError className="mt-2" message={errors.awards_ids} />
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <LazyLoadingMultiSelect
                                    initialOptions={
                                        artwork?.data.categories?.map(
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
                                        artwork?.data.periods?.map(
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
