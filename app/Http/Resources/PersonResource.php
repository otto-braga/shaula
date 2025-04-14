<?php

namespace App\Http\Resources;

use App\Models\Activity;
use App\Models\File;
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
            'bio' => $this->bio,
            // 'chrono' => $this->chrono,

            'genders' => new Collection($this->genders),
            'cities' => CityResource::collection($this->cities),

            'activity' => new ActivityResource(Activity::find($this->pivot->activity_id ?? 0)),

            'content' => $this->content,
            'files' => FileResource::collection($this->files),
            'images' => FileResource::collection($this->images),
            'general_images' => FileResource::collection($this->generalImages),
            'content_images' => FileResource::collection($this->contentImages),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'image' => new FileResource($this->images->first()),

            'artworks' => ArtworkResource::collection($this->whenLoaded('artworks')),
            'activities' => ActivityResource::collection($this->activities), // Todas as atividades dessa pessoa
            'activities_through_artworks' => ActivityResource::collection($this->activitiesThroughArtworks), // Todas as atividades dessa pessoa através das obras

            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
