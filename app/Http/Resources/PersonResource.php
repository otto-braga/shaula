<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
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
            'slug' => $this->slug,

            'name' => $this->name,
            'date_of_birth' => $this->date_of_birth,
            'date_of_death' => $this->date_of_death,
            'content' => $this->content,
            'chronology' => $this->chronology,

            'images' => FileResource::collection($this->images),
            'primary_image' => new FileResource($this->primaryImage()),
            'content_images' => FileResource::collection($this->contentImages),

            'mentions' => MentionResource::collection($this->mentions()),

            'sources' => SourceResource::collection($this->sources),

            'artworks' => ArtworkResource::collection($this->whenLoaded('artworks')),
            'activities' => ActivityResource::collection($this->activities),
            'activity' => new ActivityResource(Activity::find($this->pivot->activity_id ?? 0)),

            'periods' => PeriodResource::collection($this->periods),
            'languages' => LanguageResource::collection($this->whenLoaded('languages')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'genders' => new Collection($this->genders),
            'cities' => CityResource::collection($this->cities),

            'links' => $this->links,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
