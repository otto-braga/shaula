import AppLayout from '@/layouts/app-layout';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Tabs from './tabs';
import EditSources from '@/components/edit/sources';

export default function Sources({
    artwork,
}: {
    artwork: { data: Artwork },
}) {
    const { data, setData, post, patch, errors, processing } = useForm({
        sources_ids: artwork ? artwork.data.sources?.map((source) => source.id) : [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('artworks.update.sources', artwork.data), {
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
                            <Tabs artwork={artwork} processing={processing} />
                            <EditSources
                                model={artwork}
                                type={'artworks'}
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
