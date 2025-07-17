import { Artwork } from '@/types/artwork';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditImages from '@/components/edit/edit-images';
import EditLayout from '@/components/edit/edit-layout';

export default function Images({
    artwork,
}: {
    artwork: { data: Artwork };
}) {
    const { data, setData, post, processing } = useForm({
        files: Array<File>(),
        files_to_remove: Array<string>(),
        primary_image_uuid: artwork.data.primary_image?.uuid || '',
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('artworks.update.images', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
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
        </EditLayout>
    );
}

