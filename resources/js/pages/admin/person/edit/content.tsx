import { Person } from '@/types/person';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import EditTabs from '@/components/edit/edit-tabs';
import HtmlEditor from '@/components/edit/html-editor';
import EditLayout from '@/components/edit/edit-layout';

export default function Content({
    person,
}: {
    person: { data: Person }
}) {
    console.log('mentions', person.data.mentions);

    const { data, setData, post, processing } = useForm({
        content: person.data.content as string ?? String(),
        files: Array<File>(),
        files_to_remove: Array<string>(),
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('people.update.content', person.data), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    className='sticky z-50 top-0 bg-background'
                    model={person}
                    route_base_name="people"
                    processing={processing}
                />
                <HtmlEditor
                    content={person.data.content}
                    content_images={person.data.content_images}
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
