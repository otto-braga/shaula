import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Review } from '@/types/review';

export default function Sources({
    review,
}: {
    review: { data: Review },
}) {
    const { data, setData, post, patch, errors, processing } = useForm({
        sources_uuids: review ? review.data.sources?.map((source) => source.uuid) : [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('reviews.update.sources', review.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

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
                            <EditSources
                                model={review}
                                data={data}
                                setData={setData}
                            />
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
