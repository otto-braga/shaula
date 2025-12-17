import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Exhibit } from '@/types/exhibit';
import EditLayout from '@/components/edit/edit-layout';

export default function Sources({
    exhibit,
}: {
    exhibit: { data: Exhibit },
}) {
    const { data, setData, post, processing } = useForm({
        sources_uuids: exhibit ? exhibit.data.sources?.map((source) => source.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('exhibits.update.sources', exhibit.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={exhibit}
                    route_base_name="exhibits"
                    processing={processing}
                />
                <EditSources
                    model={exhibit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>
    );
}
