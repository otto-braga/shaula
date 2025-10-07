import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Artwork } from '@/types/artwork';
import EditLayout from '@/components/edit/edit-layout';

export default function Sources({
    artwork,
}: {
    artwork: { data: Artwork },
}) {
    const { data, setData, post, processing } = useForm({
        sources_uuids: artwork ? artwork.data.sources?.map((source) => source.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('artworks.update.sources', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={artwork}
                    route_base_name="artworks"
                    processing={processing}
                />
                <EditSources
                    model={artwork}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>
    );
}
