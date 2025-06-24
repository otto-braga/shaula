import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import EditTabs from '@/components/edit/edit-tabs';
import EditSources from '@/components/edit/edit-sources';
import { Person } from '@/types/person';

export default function Sources({
    person,
}: {
    person: { data: Person },
}) {
    const { data, setData, post, patch, errors, processing } = useForm({
        sources_ids: person ? person.data.sources?.map((source) => source.id) : [] as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('people.update.sources', person.data), {
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
                                model={person}
                                route_base_name="people"
                                processing={processing}
                            />
                            <EditSources
                                model={person}
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
