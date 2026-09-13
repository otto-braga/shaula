<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,

            'title' => $this->title,
            'date' => Carbon::parse($this->date),
            'authors' => PersonResource::collection($this->whenLoaded('authors', function () { return $this->authors->unique('id'); })),
            'content' => $this->content,

            'images' => FileResource::collection($this->relationLoaded('images') ? $this->images : []),
            'primary_image' => new FileResource($this->primaryImage()),
            'content_images' => FileResource::collection($this->relationLoaded('contentImages') ? $this->contentImages : []),

            'sources' => SourceResource::collection($this->relationLoaded('sources') ? $this->sources : []),

            'people' => PersonResource::collection($this->whenLoaded('people', function () { return $this->people->unique('id'); })),
            'activities' => ActivityResource::collection($this->whenLoaded('activities', function () { return $this->activities->unique('id'); })), // Todas as atividades dessa artwork
            'pivot' => [
                'activity' => $this->pivot && $this->pivot->activity_id ? new ActivityResource(Activity::find($this->pivot->activity_id)) : null, // Se estiver pegando essa artwork a partir de uma pessoa, activity é a atuação dessa pessoa nessa artwork
                'is_author' => $this->pivot ? (bool) $this->pivot->is_author : false,
            ],

            'categories' => CategoryResource::collection($this->relationLoaded('categories') ? $this->categories : []),
            'periods' => PeriodResource::collection($this->relationLoaded('periods') ? $this->periods : []),
            'languages' => LanguageResource::collection($this->relationLoaded('languages') ? $this->languages : []),
            'awards' => AwardResource::collection($this->relationLoaded('awards') ? $this->awards : []),

            'year' => Carbon::parse($this->date)->year, // Apenas o ano, sem o mês e dia
            'dimensions' => $this->dimensions,
            'materials' => $this->materials,

            'exhibits' => ExhibitResource::collection($this->whenLoaded('exhibits', function () { return $this->exhibits->unique('id'); })),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
