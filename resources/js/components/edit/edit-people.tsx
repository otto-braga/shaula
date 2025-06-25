import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LazyLoadingSelect, fetchDataForSelect } from '@/components/select/lazy-loading-select';
import { Button } from '@/components/ui/button';
import { ActivityPerson } from '@/types/activity-person';
import { SearchResult } from '@/types/search-result';

type EditPeopleProps = {
    data: {
        activitiesPeople: ActivityPerson[];
    };
    setData: (key: string, value: any) => void;
    errors?: Record<string, string>;
    processing?: boolean;
};

export default function EditPeople({
    data,
    setData,
    errors,
    processing,
}: EditPeopleProps) {
    const [fetchedPeople, setFetchedPeople] = useState<SearchResult[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<SearchResult | null>(null);

    useEffect(() => {
        console.log('fetchedPeople', fetchedPeople);
        setSelectedPerson(null);
    }, [fetchedPeople]);

    const [fetchedActivities, setFetchedActivities] = useState<SearchResult[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<SearchResult | null>(null);

    useEffect(() => {
        console.log('fetchedActivities', fetchedActivities);
        setSelectedActivity(null);
    }, [fetchedActivities]);

    const onAddPersonActivity = () => {
        if (selectedPerson && selectedActivity) {
            const existingPersonActivity = data.activitiesPeople.find((pa) => (
                pa.person_uuid === selectedPerson.uuid && pa.activity_uuid === selectedActivity.uuid
            ));

            if (existingPersonActivity) {
                return;
            }

            setData('activitiesPeople', [
                ...data.activitiesPeople,
                {
                    activity_uuid: selectedActivity.uuid,
                    activity_name: selectedActivity.label,
                    person_uuid: selectedPerson.uuid,
                    person_name: selectedPerson.label,
                },
            ]);

            setSelectedPerson(null);
            setSelectedActivity(null);
        }
    };

    const onRemovePersonActivity = (personActivity: ActivityPerson) => {
        setData('activitiesPeople', data.activitiesPeople.filter((pa) => (
            pa.person_uuid !== personActivity.person_uuid || pa.activity_uuid !== personActivity.activity_uuid
        )));
    }

    const getActivitiesList = (activitiesPeople: ActivityPerson[]) => {
        const uniqueActivities = activitiesPeople.reduce((acc: ActivityPerson[], current) => {
            const x = acc.find((item) => item.activity_uuid === current.activity_uuid);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        return uniqueActivities;
    };

    useEffect(() => {
        console.log('data.activitiesPeople', data.activitiesPeople);
    }, [data.activitiesPeople]);

    return (
        <>
            <div>
                <Label>Pessoa</Label>
                <LazyLoadingSelect
                    onInputChange={(q: string) => {
                        fetchDataForSelect(
                            { routeName: 'people.fetch.options', q: q, setter: setFetchedPeople },
                        )
                    }}
                    options={fetchedPeople}
                    onChange={(option: SearchResult) => {
                        setSelectedPerson(option);
                    }}
                    value={selectedPerson}
                />

                <Label>Atividade</Label>
                <LazyLoadingSelect
                    onInputChange={(q: string) => {
                        fetchDataForSelect(
                            { routeName: 'activities.fetch.options', q: q, setter: setFetchedActivities },
                        )
                    }}
                    options={fetchedActivities}
                    onChange={(option: SearchResult) => {
                        setSelectedActivity(option);
                    }}
                    value={selectedActivity}
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
                        <div key={'activity' + activity.activity_uuid} className="flex flex-col gap-2 mb-4">
                            <Label className="text-lg">{activity.activity_name}</Label>
                            <div className="flex items-center gap-2">
                                {data.activitiesPeople.filter((pa) => pa.activity_uuid === activity.activity_uuid).map((person) => (
                                    <div key={activity.activity_uuid + person.person_uuid} className="flex items-center gap-2 border p-2 rounded-md bg-gray-100 dark:bg-gray-700">
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
        </>
    );
}
