import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Activity } from '@/types/activity';
import { Person, personLabel } from '@/types/person';
import { Artwork } from '@/types/artwork';
import { Head, useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import Tabs from './tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Obras',
        href: '/admin/artwork',
    },
];

type PersonInActivity = { id: number; name: string };
type ActivityWithPeople = { id: number; name: string; people: PersonInActivity[] };

export default function People({
    artwork,
    activities,
    people,
}: {
    artwork: { data: Artwork };
    activities?: { data: Activity[] };
    people?: { data: Person[] };
}) {
    const { data, setData, post, errors, processing } = useForm({
        activities: Array<ActivityWithPeople>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('artworks.update.people', artwork.data), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const [availableActivities, setAvailableActivities] = useState<Activity[]>(activities?.data || []);
    const [loadedActivities, setLoadedActivities] = useState<ActivityWithPeople[]>(
        artwork.data.people
            .map((person) => ({
                id: person.activity.id,
                name: person.activity.name,
                people: artwork.data.people.filter((p) => p.activity.id == person.activity.id).map((p) => ({ id: p.id, name: p.name })),
            }))
            .flat()
            .filter((activity, index, self) => self.findIndex((a) => a.id === activity.id) === index),
    );
    const [selectedActivities, setSelectedActivities] = useState<ActivityWithPeople[]>([]);

    useEffect(() => {
        setSelectedActivities(loadedActivities);
        setAvailableActivities(
            availableActivities.filter((activity) => !loadedActivities.map((loadedActivity) => loadedActivity.id).includes(activity.id)),
        );
    }, [loadedActivities]);

    useEffect(() => {
        setData('activities', selectedActivities);
    }, [selectedActivities]);

    const [availablePeople, setAvailablePeople] = useState<Person[]>(people?.data || []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs artwork={artwork} processing={processing} />

                            <div>
                                <Select
                                    id="activities_ids"
                                    options={availableActivities.map((activity) => ({ value: activity.id, label: activity.name }))}
                                    onChange={(option) => {
                                        setSelectedActivities(
                                            selectedActivities.concat(
                                                availableActivities
                                                    .filter((activity) => option?.value == activity.id)
                                                    .map((activity) => ({ id: activity.id, name: activity.name, people: [] })),
                                            ),
                                        );
                                        setAvailableActivities(availableActivities.filter((activity) => option?.value != activity.id));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                            </div>

                            {selectedActivities.map((activity) => (
                                <div key={activity.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedActivities(
                                                selectedActivities.filter((selectedActivity) => selectedActivity.id != activity.id),
                                            );
                                            setAvailableActivities(availableActivities.concat(activity));
                                        }}
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </button>
                                    <span>{activity.name}</span>
                                    <div>
                                        <Select
                                            id="people_ids"
                                            isMulti
                                            options={availablePeople
                                                .filter((person) => !activity.people.map((person) => person.id).includes(person.id))
                                                .map((person) => ({ value: person.id, label: personLabel(person) }))}
                                            value={activity.people.map((person) => ({
                                                value: person.id,
                                                label: personLabel(
                                                    availablePeople.find((availablePerson) => availablePerson.id == person.id) as Person,
                                                ),
                                            }))}
                                            onChange={(options) => {
                                                setSelectedActivities(
                                                    selectedActivities.map((selectedActivity) => {
                                                        if (selectedActivity.id == activity.id) {
                                                            return {
                                                                ...selectedActivity,
                                                                people: availablePeople
                                                                    .filter((person) => options.map((option) => option.value).includes(person.id))
                                                                    .map((person) => ({ id: person.id, name: person.name })),
                                                            };
                                                        }
                                                        return selectedActivity;
                                                    }),
                                                );
                                            }}
                                            styles={handleReactSelectStyling()}
                                        />
                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
