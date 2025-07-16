import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Review } from '@/types/review';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { MultiValue } from 'react-select';
import { SearchResult } from '@/types/search-result';
import EditLayout from '@/components/edit/edit-layout';

// type DateWithTimezone =

export default function Index({
    review,
}: {
    review: { data: Review };
}) {
    const isEdit = !!review;

    console.log(review);

    const { data, setData, post, processing } = useForm({
        title: review ? review.data.title : '',
        date: review ? review.data.date : '',

        authors_uuids: review ? review.data.authors.map((author) => author.uuid) : [] as string[],
        categories_uuids: review ? review.data.categories?.map((category) => category.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            post(route('reviews.update', review.data), {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            post(route('reviews.store'), {
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={review}
                    route_base_name="reviews"
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
                        value={review?.data.authors?.map(
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
                        <Label htmlFor="date">Data</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            autoComplete="date"
                            className="w-full"
                        />
                        <InputError className="mt-2" message={errors.date} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="categories">Categorias</Label>
                    <LazyLoadingSelectWithStates
                        isMulti
                        routeName={'categories.fetch.options'}
                        value={review?.data.categories?.map(
                            category => ({ uuid: category.uuid, label: category.name })
                        )}
                        onChange={(options: MultiValue<SearchResult>) => {
                            setData('categories_uuids', options.map((option) => (option.uuid)))
                        }}
                    />
                    <InputError className="mt-2" message={errors.categories_uuids} />
                </div>
            </form>
        </EditLayout>
    );
}
