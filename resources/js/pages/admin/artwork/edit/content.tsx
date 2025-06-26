import AppLayout from '@/layouts/app-layout';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';

export default function Content({
    artwork,
}: {
    artwork: { data: Artwork }
}) {
    console.log('mentions', artwork.data.mentions);

    const { data, setData, post, errors, processing } = useForm({
        content: artwork.data.content as string ?? String(),
        files: Array<File>(),
        files_to_remove: Array<string>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('artworks.update.content', artwork.data), {
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
                                model={artwork}
                                route_base_name="artworks"
                                processing={processing}
                            />

                            <HtmlEditor
                                content={artwork.data.content}
                                content_images={artwork.data.content_images}
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
