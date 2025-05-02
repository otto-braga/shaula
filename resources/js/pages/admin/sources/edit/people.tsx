import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import Tabs from './tabs';
import { Option } from '@/components/select/lazyLoadingMultiSelect';
import { LazyLoadingSelect } from '@/components/select/lazyLoadingSelect';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obras',
        href: '/admin/artwork',
    },
];

type ActivityPerson = {
    activity_id: number; activity_name: string; person_id: number; person_name: string; };

export default function People({
    artwork,
}: {
    artwork: { data: Artwork };
}) {
    const { data, setData, post, errors, processing } = useForm({
        activitiesPeople: artwork.data.people.map((person) => ({
            activity_id: person.activity.id,
            activity_name: person.activity.name,
            person_id: person.id,
            person_name: person.name,
        })) as ActivityPerson[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('artworks.update.people', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [selectedPerson, setSelectedPerson] = useState<Option | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<Option | null>(null);

    const onAddPersonActivity = () => {
        if (selectedPerson && selectedActivity) {
            const existingPersonActivity = data.activitiesPeople.find((pa) => (
                pa.person_id === selectedPerson.value && pa.activity_id === selectedActivity.value
            ));

            if (existingPersonActivity) {
                return;
            }

            setData('activitiesPeople', [
                ...data.activitiesPeople,
                {
                    activity_id: selectedActivity.value,
                    activity_name: selectedActivity.label,
                    person_id: selectedPerson.value,
                    person_name: selectedPerson.label,
                },
            ]);
        }
    };

    const onRemovePersonActivity = (personActivity: ActivityPerson) => {
        setData('activitiesPeople', data.activitiesPeople.filter((pa) => (
            pa.person_id !== personActivity.person_id || pa.activity_id !== personActivity.activity_id
        )));
    }

    const getActivitiesList = (activitiesPeople: ActivityPerson[]) => {
        const uniqueActivities = activitiesPeople.reduce((acc: ActivityPerson[], current) => {
            const x = acc.find((item) => item.activity_id === current.activity_id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        return uniqueActivities;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} />

                            <div>
                                <Label>Pessoa</Label>
                                <LazyLoadingSelect
                                    initialOption={{ value: 0, label: '' }}
                                    routeName="people.fetch.options"
                                    setterFunction={(option) => {
                                        setSelectedPerson(option);
                                    }}
                                />

                                <Label>Atividade</Label>
                                <LazyLoadingSelect
                                    initialOption={{ value: 0, label: '' }}
                                    routeName="activities.fetch.options"
                                    setterFunction={(option) => {
                                        setSelectedActivity(option);
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={onAddPersonActivity}
                                >
                                    Adicionar
                                </Button>

                                <div className="mt-4">
                                    {getActivitiesList(data.activitiesPeople).map((activity) => (
                                        <div key={activity.activity_id} className="flex flex-col gap-2 mb-4">
                                            <Label className="text-lg">{activity.activity_name}</Label>
                                            <div className="flex items-center gap-2">
                                                {data.activitiesPeople.filter((pa) => pa.activity_id === activity.activity_id).map((person) => (
                                                    <div key={person.person_id} className="flex items-center gap-2 border p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                                        <span>{person.person_name}</span>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => onRemovePersonActivity(person)}
                                                        >
                                                            <Trash size={16} />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
