import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Period } from '@/types/period';
import EditLayout from '@/components/edit/edit-layout';

export default function Sources({
    period,
}: {
    period: { data: Period },
}) {
    const { data, setData, post, processing } = useForm({
        sources_uuids: period ? period.data.sources?.map((source) => source.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('periods.update.sources', period.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={period}
                    route_base_name="periods"
                    processing={processing}
                />
                <EditSources
                    model={period}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>
    );
}
