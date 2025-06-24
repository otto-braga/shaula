<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,

            'title' => $this->title,
            'date' => $this->date,
            'authors' => PersonResource::collection($this->authors),
            'content' => $this->content,

            'images' => FileResource::collection($this->images),
            'primary_image' => new FileResource($this->primaryImage()),
            'content_images' => FileResource::collection($this->contentImages),

            'mentions' => MentionResource::collection($this->mentions()),

            'sources' => SourceResource::collection($this->sources),

            'people' => PersonResource::collection($this->people),
            'activities' => ActivityResource::collection($this->activities()), // Todas as atividades dessa artwork
            'activity' => new ActivityResource(Activity::find($this->pivot->activity_id ?? 0)), // Se estiver pegando essa artwork a partir de uma pessoa, activity é a atuação dessa pessoa nessa artwork

            'categories' => CategoryResource::collection($this->categories),
            'periods' => PeriodResource::collection($this->periods),
            'languages' => LanguageResource::collection($this->languages),
            'awards' => AwardResource::collection($this->awards),
            'dimensions' => $this->dimensions,
            'materials' => $this->materials,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
