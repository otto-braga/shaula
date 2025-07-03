import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Period } from '@/types/period';

export default function Sources({
    period,
}: {
    period: { data: Period },
}) {
    const { data, setData, post, patch, errors, processing } = useForm({
        sources_uuids: period ? period.data.sources?.map((source) => source.uuid) : [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('periods.update.sources', period.data), {
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
                            <EditTabs
                                model={period}
                                route_base_name="periods"
                                processing={processing}
                            />
                            <EditSources
                                model={period}
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
