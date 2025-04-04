import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import Tabs from './Tabs';
import { Person, personLabel } from '@/types/person';
import InputLabel from '@/Components/InputLabel';
import CreatableSelect from 'react-select/creatable';
import InputError from '@/Components/InputError';
import { Activity, activityLabel } from '@/types/activity';
import { Delete } from '@mui/icons-material';

// type ActivityWithPeople = Activity & { people: Person[] };

type PersonInActivity = { id: number, name: string };
type ActivityWithPeople = { id: number, name: string, people: PersonInActivity[] };

export default function People({
    work,
    activities,
    people,
}: PageProps<{
    work: { data: Work }
    activities?: { data: Activity[] },
    people?: { data: Person[] },
}>) {
    console.log(work);

    const { data, setData, post, errors, processing } = useForm({
        activities: Array<ActivityWithPeople>(),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('work.update.people', work.data.uuid), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    // activities

    const [availableActivities, setAvailableActivities] = useState<Activity[]>(activities?.data || []);
    const [selectedActivities, setSelectedActivities] = useState<ActivityWithPeople[]>([]);
    const [loadedActivities, setLoadedActivities] = useState<ActivityWithPeople[]>(
        work.data.people.map((person) => {
            return {
                id: person.activity.id,
                name: person.activity.name,
                people: work.data.people.filter((p) => p.activity.id == person.activity.id).map((p) => ({ id: p.id, name: p.name }))
            }
        })
            .flat()
            .filter((activity, index, self) => self.findIndex((a) => a.id === activity.id) === index)
    );

    useEffect(() => {
        setSelectedActivities(loadedActivities);
        setAvailableActivities(availableActivities.filter((activity) => !loadedActivities.map((loadedActivity) => loadedActivity.id).includes(activity.id)));
    }, [loadedActivities]);

    function addNewActivity(newActivity: Activity) {
        if (availableActivities.concat(selectedActivities.map((activity) => ({ id: activity.id, name: activity.name }))).find((activity) => activity.name === newActivity.name)) return;
        setAvailableActivities([...availableActivities, newActivity]);
        setSelectedActivities(selectedActivities.concat({ id: newActivity.id, name: newActivity.name, people: [] }));
        setAvailableActivities(availableActivities.filter((activity) => activity.id != newActivity.id));
    }

    useEffect(() => {
        setData('activities', selectedActivities);
    }, [selectedActivities]);

    // people

    const [availablePeople, setAvailablePeople] = useState<Person[]>(people?.data || []);

    function addNewPerson(newPerson: Person, activity: ActivityWithPeople) {
        if (availablePeople.find((person) => person.name === newPerson.name)) return;
        setAvailablePeople([...availablePeople, newPerson]);
        setSelectedActivities(selectedActivities.map((selectedActivity) => {
            if (selectedActivity.id == activity.id) {
                return { ...selectedActivity, people: selectedActivity.people.concat({ id: newPerson.id, name: newPerson.name }) };
            }
            return selectedActivity;
        }));
    }

    // log data

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="">
                    Editor
                </h2>
            }
        >
            <Head title={'Editor'} />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">
                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="space-y-6 bg-inherit">

                            <Tabs work={work} processing={processing} />

                            <div>
                                <InputLabel htmlFor="activities_ids" value="Atividades" />
                                <CreatableSelect
                                    id="activities_ids"
                                    options={availableActivities.map((activity) => ({ value: activity.id, label: activityLabel(activity) }))}
                                    onCreateOption={(name) => addNewActivity({ id: -1, name: name } as Activity)}
                                    onChange={(option) => {
                                        setSelectedActivities(selectedActivities.concat(availableActivities.filter((activity) => option?.value == activity.id).map((activity) => ({ id: activity.id, name: activity.name, people: [] }))));
                                        setAvailableActivities(availableActivities.filter((activity) => option?.value != activity.id));
                                    }}
                                    className='w-full'
                                />
                                {/* <InputError className="mt-2" message={errors.activities} /> */}
                            </div>

                            {selectedActivities.map((activity) => (
                                <div key={activity.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedActivities(selectedActivities.filter((selectedActivity) => selectedActivity.id != activity.id));
                                            setAvailableActivities(availableActivities.concat(activity));
                                        }}
                                    >
                                        <Delete />
                                    </button>
                                    <span>{activityLabel(activity)}</span>
                                    <div>
                                        <InputLabel htmlFor="people_ids" value="Pessoas" />
                                        <CreatableSelect
                                            id="people_ids"
                                            isMulti
                                            options={availablePeople.filter((person) => !activity.people.map((person) => person.id).includes(person.id)).map((person) => ({ value: person.id, label: personLabel(person) }))}
                                            value={activity.people.map((person) => ({ value: person.id, label: personLabel(availablePeople.find((availablePerson) => availablePerson.id == person.id) as Person) }))}
                                            onCreateOption={(name) => {
                                                addNewPerson({ id: -1, name: name } as Person, activity);
                                            }}
                                            onChange={(options) => {
                                                setSelectedActivities(selectedActivities.map((selectedActivity) => {
                                                    if (selectedActivity.id == activity.id) {
                                                        return {
                                                            ...selectedActivity,
                                                            people: availablePeople.filter(
                                                                (person) => options
                                                                    .map((option) => option.value)
                                                                    .includes(person.id))
                                                                    .map((person) => ({ id: person.id, name: person.name }))
                                                        };
                                                    }
                                                    return selectedActivity;
                                                }
                                                ));
                                            }}
                                            className='w-full'
                                        />
                                        {/* <InputError className="mt-2" message={errors.people_ids} /> */}
                                    </div>
                                </div>
                            ))}

                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}