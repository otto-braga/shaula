import { Exhibit } from '@/types/exhibit';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';
import EditLayout from '@/components/edit/edit-layout';

export default function Content({
    exhibit,
}: {
    exhibit: { data: Exhibit }
}) {
    const { data, setData, post, processing } = useForm({
        content: exhibit.data.content as string ?? String(),
        files: Array<File>(),
        files_to_remove: Array<string>(),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('exhibits.update.content', exhibit.data), {
            preserveScroll: true,
            preserveState: true,
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

                <HtmlEditor
                    content={exhibit.data.content}
                    content_images={exhibit.data.content_images}
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
