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

            'images' => FileResource::collection($this->relationLoaded('images') ? $this->images : []),
            'primary_image' => ($this->relationLoaded('images') && $this->primaryImage()) ? new FileResource($this->primaryImage()) : null,
            'content_images' => FileResource::collection($this->relationLoaded('contentImages') ? $this->contentImages : []),

            'sources' => SourceResource::collection($this->relationLoaded('sources') ? $this->sources : []),

            'artworks' => ArtworkResource::collection($this->whenLoaded('artworks', function () { return static::uniquePersonables($this->artworks); })),
            'exhibits' => ExhibitResource::collection($this->whenLoaded('exhibits', function () { return static::uniquePersonables($this->exhibits); })),
            'activities' => ActivityResource::collection($this->whenLoaded('activities', function () { return $this->activities->unique('id'); })), // Todas as atividades dessa artwork
            'pivot' => [
                'activity' => $this->pivot && $this->pivot->activity_id ? new ActivityResource(static::findActivity($this->pivot->activity_id)) : null, // Se estiver pegando essa pessoa a partir de uma obra, activity é a atuação dessa pessoa nessa artwork
                'is_author' => $this->pivot ? (bool) $this->pivot->is_author : false,
            ],

            'periods' => PeriodResource::collection($this->relationLoaded('periods') ? $this->periods : []),
            'languages' => LanguageResource::collection($this->whenLoaded('languages')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews', function () { return static::uniquePersonables($this->reviews); })),
            'history_articles' => HistoryArticleResource::collection($this->whenLoaded('historyArticles', function () { return static::uniquePersonables($this->historyArticles); })),
            'genders' => new Collection($this->relationLoaded('genders') ? $this->genders : []),
            'cities' => CityResource::collection($this->relationLoaded('cities') ? $this->cities : []),
            'awards' => AwardResource::collection($this->relationLoaded('awards') ? $this->awards : []),

            'links' => $this->links,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    protected static function uniquePersonables($collection)
    {
        return $collection->groupBy('id')->map(function ($items) {
            $first = $items->first();
            if ($first && $first->pivot && $items->count() > 1) {
                $first->pivot->is_author = $items->contains(fn ($item) => (bool) ($item->pivot->is_author ?? false));
                $firstWithActivity = $items->first(fn ($item) => !empty($item->pivot->activity_id));
                if ($firstWithActivity) {
                    $first->pivot->activity_id = $firstWithActivity->pivot->activity_id;
                }
            }
            return $first;
        })->values();
    }

    protected static function findActivity($id)
    {
        static $activityCache = [];
        return $activityCache[$id] ??= Activity::find($id);
    }
}
