import { Person } from '@/types/person';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditImages from '@/components/edit/edit-images';
import EditLayout from '@/components/edit/edit-layout';

export default function Images({
    person,
}: {
    person: { data: Person };
}) {
    const { data, setData, post, processing } = useForm({
        files: Array<File>(),
        files_to_remove: Array<string>(),
        primary_image_uuid: person.data.primary_image?.uuid || '',
    });
    const { errors } = usePage().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('data', data);
        post(route('people.update.images', person.data), {
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

                <EditImages
                    stored_images={person.data.images}
                    stored_primary_image_uuid={person.data.primary_image?.uuid}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </form>
        </EditLayout>

    );
}

