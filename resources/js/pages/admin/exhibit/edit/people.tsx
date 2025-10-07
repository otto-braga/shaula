import { Exhibit } from '@/types/exhibit';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditPeople from '@/components/edit/edit-people';
import { ActivityPerson } from '@/types/activity-person';
import EditLayout from '@/components/edit/edit-layout';

export default function People({
    exhibit,
}: {
    exhibit: { data: Exhibit };
}) {
    const { data, setData, post, processing } = useForm({
        activitiesPeople: exhibit.data.people.map((person) => ({
            activity_uuid: person.pivot.activity?.uuid,
            activity_name: person.pivot.activity?.name,
            person_uuid: person.uuid,
            person_name: person.name,
        })) as ActivityPerson[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('exhibits.update.people', exhibit.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-6 bg-inherit">
                <EditTabs
                    model={exhibit}
                    route_base_name="exhibits"
                    processing={processing}
                />

                <EditPeople
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>
    );
}
