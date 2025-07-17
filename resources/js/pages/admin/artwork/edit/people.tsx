import { Artwork } from '@/types/artwork';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditPeople from '@/components/edit/edit-people';
import { ActivityPerson } from '@/types/activity-person';
import EditLayout from '@/components/edit/edit-layout';

export default function People({
    artwork,
}: {
    artwork: { data: Artwork };
}) {
    const { data, setData, post, processing } = useForm({
        activitiesPeople: artwork.data.people.map((person) => ({
            activity_uuid: person.pivot.activity?.uuid,
            activity_name: person.pivot.activity?.name,
            person_uuid: person.uuid,
            person_name: person.name,
        })) as ActivityPerson[],
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('artworks.update.people', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <EditLayout>
            <form onSubmit={submit} className="space-y-6 bg-inherit">
                <EditTabs
                    model={artwork}
                    route_base_name="artworks"
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
