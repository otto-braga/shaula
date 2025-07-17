<?php

namespace App\Traits;

use App\Models\Activity;
use App\Models\Person;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/** * Trait UpdatesPeople
 *
 * This trait handles the updating of people associated with a model.
 * It processes the request to update the relationships between activities and people.
 */
trait UpdatesPeople
{
    /**
     * Handle the update of people associated with a model, with associated activities.
     *
     * @param Request $request
     * @param Model $model
     * @return void
     */
    protected function handlePeopleUpdate(Request $request, Model $model): void
    {
        $request_activitiesPeople = $request->activitiesPeople;
        $activitiesPeople = [];

        // Parse the request uuids and convert them to IDs
        foreach ($request_activitiesPeople as $activityPerson) {
            $activity = Activity::where('uuid', $activityPerson['activity_uuid'])->first();
            $activity_id = $activity ? $activity->id : null;

            $person = Person::where('uuid', $activityPerson['person_uuid'])->first();
            $person_id = $person ? $person->id : null;

            if ($activity_id && $person_id) {
                $activitiesPeople[] = [
                    'activity_id' => $activity_id,
                    'person_id' => $person_id,
                ];
            }
        }

        if ($activitiesPeople && count($activitiesPeople) > 0) {
            // Detach all people from the model that are not in the current activitiesPeople
            foreach ($activitiesPeople as $activityPerson) {
                foreach ($model->people as $person) {
                    if (
                        $person->id == $activityPerson['person_id']
                        && $person->pivot->activity_id == $activityPerson['activity_id']
                    ) {
                        continue;
                    }

                    $model->people()->detach($person->id, ['activity_id' => $person->pivot->activity_id]);
                }
            }

            // Attach the people from the current activitiesPeople to the model
            foreach ($activitiesPeople as $activityPerson) {
                if (
                    !$model->people()
                        ->where('person_id', $activityPerson['person_id'])
                        ->where('activity_id', $activityPerson['activity_id'])
                        ->first()
                ) {
                    $model->people()->attach(
                        $activityPerson['person_id'],
                        ['activity_id' => $activityPerson['activity_id']]
                    );
                }
            }
        }

        $model->save();
    }
}
