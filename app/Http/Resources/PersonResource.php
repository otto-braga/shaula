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

            'sources' => SourceResource::collection($this->sources),

            'artworks' => ArtworkResource::collection($this->whenLoaded('artworks')),
            'activities' => ActivityResource::collection($this->whenLoaded('activities')), // Todas as atividades dessa artwork
            'pivot' => [
                'activity' => $this->pivot ? new ActivityResource(Activity::find($this->pivot->activity_id)) : null, // Se estiver pegando essa pessoa a partir de uma obra, activity é a atuação dessa pessoa nessa artwork
                'is_author' => $this->pivot ? $this->pivot->is_author : false,
            ],

            'periods' => PeriodResource::collection($this->periods),
            'languages' => LanguageResource::collection($this->whenLoaded('languages')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'genders' => new Collection($this->genders),
            'cities' => CityResource::collection($this->cities),
            'awards' => AwardResource::collection($this->awards),

            'links' => $this->links,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
