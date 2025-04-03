<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,

            'name' => $this->name,
            'slug' => $this->slug,

            'date_of_birth' => $this->date_of_birth,
            'date_of_death' => $this->date_of_death,

            'bio' => $this->bio,
            'chrono' => $this->chrono,

            // 'genders' => $this->genders, // collection
            // 'cities' => $this->cities, // collection
            // 'works' => WorkResource::collection($this->whenLoaded('works')),
            'works' => WorkResource::collection($this->whenLoaded('works')),
            'activity' => new ActivityResource(Activity::find($this->pivot->activity_id ?? 0)),
            // 'links' => $this->links, // collection
            // 'activities' => $this->activities, // collection
            // 'activitiesThroughWorks' => $this->activitiesThroughWorks, // collection
            // 'languages' => $this->languages, // collection
            // 'languagesThroughWorks' => $this->languagesThroughWorks, // collection
            // 'awards' => $this->awards, // collection
        ];
    }
}
