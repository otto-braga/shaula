import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { SearchResult } from '@/types/search-result';
import { MultiValue } from 'react-select';

export default function Index({
    artwork,
}: {
    artwork: { data: Artwork },
}) {
    const isEdit = !!artwork;

    const { data, setData, post, patch, errors, processing } = useForm({
        title: artwork ? artwork.data.title : '' as string,
        date: artwork ? new Date(artwork.data.date).getFullYear() : '' as string,

        authors_uuids: artwork ? artwork.data.authors.map((author) => author.uuid) : [] as string[],
        periods_uuids: artwork ? artwork.data.periods?.map((period) => period.uuid) : [] as number[],
        languages_uuids: artwork ? artwork.data.languages?.map((language) => language.uuid) : [] as string[],
        categories_uuids: artwork ? artwork.data.categories?.map((category) => category.uuid) : [] as number[],
        awards_uuids: artwork ? artwork.data.awards?.map((award) => award.uuid) : [] as number[],

        dimensions: artwork ? artwork.data.dimensions : '',
        materials: artwork ? artwork.data.materials : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

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
                                <Label htmlFor="authors_uuids">Autores</Label>
                                <LazyLoadingSelectWithStates
                                    isMulti
                                    routeName={'people.fetch.options'}
                                    value={artwork?.data.authors?.map(
                                        author => ({ uuid: author.uuid, label: author.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('authors_uuids', options.map((option) => (option.uuid)))
                                    }}
                                />
                                <InputError className="mt-2" message={errors.authors_uuids} />
                            </div>

                            <div className="flex flex-row gap-3">
                                <div className="w-full">
                                    <Label htmlFor="date">Ano</Label>
                                    <Input
                                        id="date"
                                        type="number"
                                        value={data.date ?? ''}
                                        pattern='[0-9]{4}'
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
                                <Label htmlFor="periods_uuids">Periodização</Label>
                                <LazyLoadingSelectWithStates
                                    isMulti
                                    routeName={'periods.fetch.options'}
                                    value={artwork?.data.periods?.map(
                                        period => ({ uuid: period.uuid, label: period.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('periods_uuids', options.map((option) => (option.uuid)))
                                    }}
                                />
                                <InputError className="mt-2" message={errors.periods_uuids} />
                            </div>

                            <div>
                                <Label htmlFor="languages">Linguagens</Label>
                                <LazyLoadingSelectWithStates
                                    isMulti
                                    routeName={'languages.fetch.options'}
                                    value={artwork?.data.languages?.map(
                                        language => ({ uuid: language.uuid, label: language.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('languages_uuids', options.map((option) => (option.uuid)))
                                    }}
                                />
                                <InputError className="mt-2" message={errors.languages_uuids} />
                            </div>

                            <div>
                                <Label htmlFor="categories_uuids">Categorias</Label>
                                <LazyLoadingSelectWithStates
                                    isMulti
                                    routeName={'categories.fetch.options'}
                                    value={artwork?.data.categories?.map(
                                        category => ({ uuid: category.uuid, label: category.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('categories_uuids', options.map((option) => (option.uuid)))
                                    }}
                                />
                                <InputError className="mt-2" message={errors.categories_uuids} />
                            </div>

                            <div>
                                <Label htmlFor="awards_uuids">Prêmios</Label>
                                <LazyLoadingSelectWithStates
                                    isMulti
                                    routeName={'awards.fetch.options'}
                                    value={artwork?.data.awards?.map(
                                        award => ({ uuid: award.uuid, label: award.name })
                                    )}
                                    onChange={(options: MultiValue<SearchResult>) => {
                                        setData('awards_uuids', options.map((option) => (option.uuid)))
                                    }}
                                />
                                <InputError className="mt-2" message={errors.awards_uuids} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
