import AppLayout from '@/layouts/app-layout';
import { Review } from '@/types/review';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';

export default function Content({
    review,
}: {
    review: { data: Review }
}) {
    console.log('mentions', review.data.mentions);

    const { data, setData, post, processing } = useForm({
        content: review.data.content as string ?? String(),
        files: Array<File>(),
        files_to_remove: Array<string>(),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('reviews.update.content', review.data), {
            preserveScroll: true,
            preserveState: true,
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

                            <HtmlEditor
                                content={review.data.content}
                                content_images={review.data.content_images}
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                            />

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
