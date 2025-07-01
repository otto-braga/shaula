import AppLayout from '@/layouts/app-layout';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditImages from '@/components/edit/edit-images';

export default function Images({
    artwork,
}: {
    artwork: { data: Artwork };
}) {
    const { data, setData, post, errors, processing } = useForm({
        files: Array<File>(),
        files_to_remove: Array<string>(),
        primary_image_uuid: artwork.data.primary_image?.uuid || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('artworks.update.images', artwork.data), {
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
                                model={artwork}
                                route_base_name="artworks"
                                processing={processing}
                            />

                            <EditImages
                                stored_images={artwork.data.images}
                                stored_primary_image_uuid={artwork.data.primary_image?.uuid}
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

