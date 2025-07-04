import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Review } from '@/types/review';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LazyLoadingMultiSelect } from '@/components/select/lazyLoadingMultiSelect';
import EditTabs from '@/components/edit/edit-tabs';
import { LazyLoadingSelectWithStates } from '@/components/select/lazy-loading-select';
import { MultiValue } from 'react-select';
import { SearchResult } from '@/types/search-result';

// type DateWithTimezone =

export default function Index({
    review,
}: {
    review: { data: Review };
}) {
    const isEdit = !!review;

    console.log(review);

    const { data, setData, post, patch, errors, processing } = useForm({
        title: review ? review.data.title : '',
        date: review ? review.data.date : '',

        authors_uuids: review ? review.data.authors.map((author) => author.uuid) : [] as string[],
        categories_uuids: review ? review.data.categories?.map((category) => category.uuid) : [] as string[],
    });

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

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value;
        const date = new Date(inputDate);
        // const offset = -date.getTimezoneOffset();
        // // date.setUTCHours(0, 0, 0, 0); // Set hours to 0 for UTC
        // date.setUTCMinutes(offset, 0, 0); // Adjust for timezone offset
        // // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone); // Get the user's timezone

        // // console.log(date.getTimezoneOffset()/60);

        setData('date', date.toISOString().split('T')[0] + 'T' + Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    return (
        <AppLayout>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
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
                                        value={data.date ? data.date.split('T')[0] : ''}
                                        onChange={handleDateChange}
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
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
