import EditLayout from '@/components/edit/edit-layout';
import EditTabs from '@/components/edit/edit-tabs';
import InputError from '@/components/input-error';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exhibit } from '@/types/exhibit';
import { SearchResult } from '@/types/search-result';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { MultiValue } from 'react-select';

export default function Index({ exhibit }: { exhibit: { data: Exhibit } }) {
    const isEdit = !!exhibit;

    const { data, setData, post, patch, processing } = useForm({
        title: exhibit ? exhibit.data.title : ('' as string),
        start_date: exhibit ? (exhibit.data.start_date ?? '') : ('' as string),
        end_date: exhibit ? (exhibit.data.end_date ?? '') : ('' as string),

        authors_uuids: exhibit ? exhibit.data.authors.map((author) => author.uuid) : ([] as string[]),
        periods_uuids: exhibit ? exhibit.data.periods?.map((period) => period.uuid) : ([] as string[]),
        categories_uuids: exhibit ? exhibit.data.categories?.map((category) => category.uuid) : ([] as string[]),
        awards_uuids: exhibit ? exhibit.data.awards?.map((award) => award.uuid) : ([] as string[]),
        artworks_uuids: exhibit ? exhibit.data.artworks?.map((artwork) => artwork.uuid) : ([] as string[]),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('exhibits.update', exhibit.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('exhibits.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs model={exhibit} route_base_name="exhibits" processing={processing} />

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
                        value={exhibit?.data.authors?.map((author) => ({ uuid: author.uuid, label: author.name }))}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData(
                                'authors_uuids',
                                options.map((option) => option.uuid),
                            );
                        }}
                    />
                    <InputError className="mt-2" message={errors.authors_uuids} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="w-full">
                        <Label htmlFor="start_date">Data de Início</Label>
                        <Input
                            id="start_date"
                            type="date"
                            value={data.start_date ?? ''}
                            onChange={(e) => setData('start_date', e.target.value)}
                            autoComplete="off"
                            className="w-full"
                        />
                        <InputError className="mt-2" message={errors.start_date} />
                    </div>
                    <div className="w-full">
                        <Label htmlFor="end_date">Data de Fim</Label>
                        <Input
                            id="end_date"
                            type="date"
                            value={data.end_date ?? ''}
                            onChange={(e) => setData('end_date', e.target.value)}
                            autoComplete="off"
                            className="w-full"
                        />
                        <InputError className="mt-2" message={errors.end_date} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="periods_uuids">Periodização</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'periods.fetch.options'}
                        value={exhibit?.data.periods?.map((period) => ({ uuid: period.uuid, label: period.name }))}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData(
                                'periods_uuids',
                                options.map((option) => option.uuid),
                            );
                        }}
                    />
                    <InputError className="mt-2" message={errors.periods_uuids} />
                </div>

                <div>
                    <Label htmlFor="categories_uuids">Categorias</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'categories.fetch.options'}
                        value={exhibit?.data.categories?.map((category) => ({ uuid: category.uuid, label: category.name }))}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData(
                                'categories_uuids',
                                options.map((option) => option.uuid),
                            );
                        }}
                    />
                    <InputError className="mt-2" message={errors.categories_uuids} />
                </div>

                <div>
                    <Label htmlFor="awards_uuids">Prêmios</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'awards.fetch.options'}
                        value={exhibit?.data.awards?.map((award) => ({ uuid: award.uuid, label: award.name }))}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData(
                                'awards_uuids',
                                options.map((option) => option.uuid),
                            );
                        }}
                    />
                    <InputError className="mt-2" message={errors.awards_uuids} />
                </div>

                <div>
                    <Label htmlFor="artworks_uuids">Obras</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'artworks.fetch.options'}
                        value={exhibit?.data.artworks?.map((artwork) => ({ uuid: artwork.uuid, label: artwork.title }))}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData(
                                'artworks_uuids',
                                options.map((option) => option.uuid),
                            );
                        }}
                    />
                    <InputError className="mt-2" message={errors.artworks_uuids} />
                </div>
            </form>
        </EditLayout>
    );
}
