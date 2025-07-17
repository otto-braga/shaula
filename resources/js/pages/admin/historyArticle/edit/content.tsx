import { HistoryArticle } from '@/types/historyArticle';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';
import EditLayout from '@/components/edit/edit-layout';

export default function Content({
    historyArticle,
}: {
    historyArticle: { data: HistoryArticle }
}) {
    console.log('mentions', historyArticle.data.mentions);

    const { data, setData, post, processing } = useForm({
        content: historyArticle.data.content as string ?? String(),
        files: Array<File>(),
        files_to_remove: Array<string>(),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('history_articles.update.content', historyArticle.data), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={historyArticle}
                    route_base_name="history_articles"
                    processing={processing}
                />

                <HtmlEditor
                    content={historyArticle.data.content}
                    content_images={historyArticle.data.content_images}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                />

            </form>
        </EditLayout>
    );
}
