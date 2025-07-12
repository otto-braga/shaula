import AppLayout from '@/layouts/app-layout';
import { Person } from '@/types/person';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditImages from '@/components/edit/edit-images';

export default function Images({
    person,
}: {
    person: { data: Person };
}) {
    const { data, setData, post, processing } = useForm({
        files: Array<File>(),
        files_to_remove: Array<string>(),
        primary_image_uuid: person.data.primary_image?.uuid || '',
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('people.update.images', person.data), {
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
                                model={person}
                                route_base_name="people"
                                processing={processing}
                            />

                            <EditImages
                                stored_images={person.data.images}
                                stored_primary_image_uuid={person.data.primary_image?.uuid}
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

