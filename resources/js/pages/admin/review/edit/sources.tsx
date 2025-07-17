import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Review } from '@/types/review';
import EditLayout from '@/components/edit/edit-layout';

export default function Sources({
    review,
}: {
    review: { data: Review },
}) {
    const { data, setData, post, processing } = useForm({
        sources_uuids: review ? review.data.sources?.map((source) => source.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('reviews.update.sources', review.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
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
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>
    );
}
