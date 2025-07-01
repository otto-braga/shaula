import AppLayout from '@/layouts/app-layout';
import { Period } from '@/types/period';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditImages from '@/components/edit/edit-images';

export default function Images({
    period,
}: {
    period: { data: Period };
}) {
    const { data, setData, post, errors, processing } = useForm({
        files: Array<File>(),
        files_to_remove: Array<string>(),
        primary_image_uuid: period.data.primary_image?.uuid || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('periods.update.images', period.data), {
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
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <EditTabs
                                model={period}
                                route_base_name="periods"
                                processing={processing}
                            />

                            <EditImages
                                stored_images={period.data.images}
                                stored_primary_image_uuid={period.data.primary_image?.uuid}
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                            />
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

