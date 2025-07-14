import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { HistoryArticle } from '@/types/historyArticle';

export default function Sources({
    historyArticle,
}: {
    historyArticle: { data: HistoryArticle },
}) {
    const { data, setData, post, processing } = useForm({
        sources_uuids: historyArticle ? historyArticle.data.sources?.map((source) => source.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('history_articles.update.sources', historyArticle.data), {
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
                                model={historyArticle}
                                route_base_name="history_articles"
                                processing={processing}
                            />
                            <EditSources
                                model={historyArticle}
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
