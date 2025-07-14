import AppLayout from '@/layouts/app-layout';
import { Period } from '@/types/period';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';

export default function Content({
    period,
}: {
    period: { data: Period }
}) {
    console.log('mentions', period.data.mentions);

    const { data, setData, post, processing } = useForm({
        content: period.data.content as string ?? String(),
        files: Array<File>(),
        files_to_remove: Array<string>(),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('periods.update.content', period.data), {
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
                                model={period}
                                route_base_name="periods"
                                processing={processing}
                            />

                            <HtmlEditor
                                content={period.data.content}
                                content_images={period.data.content_images}
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
