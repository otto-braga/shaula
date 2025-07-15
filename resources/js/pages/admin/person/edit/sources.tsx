import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Person } from '@/types/person';
import EditLayout from '@/components/edit/edit-layout';

export default function Sources({
    person,
}: {
    person: { data: Person },
}) {
    const { data, setData, post, processing } = useForm({
        sources_uuids: person ? person.data.sources?.map((source) => source.uuid) : [] as string[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('people.update.sources', person.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-3 bg-inherit">
                <EditTabs
                    model={person}
                    route_base_name="people"
                    processing={processing}
                />
                <EditSources
                    model={person}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>
    );
}
