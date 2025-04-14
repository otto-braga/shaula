<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        $model = $this;
        if ($this->work) {
            $model = $this->work;
        }

        return [
            'id' => $model->id,
            'uuid' => $model->uuid,
            'slug' => $model->slug,

            'title' => $model->title,
            'date' => $model->date,
            'authors' => PersonResource::collection($model->authors),
            'content' => $model->content,
            'files' => FileResource::collection($model->files),
            'images' => FileResource::collection($model->images),
            'general_images' => FileResource::collection($model->generalImages),
            'content_images' => FileResource::collection($model->contentImages),
            'categories' => CategoryResource::collection($model->categories),
            'tags' => TagResource::collection($model->tags),

            'people' => PersonResource::collection($model->people),
            'activities' => ActivityResource::collection($model->activities()), // Todas as atividades dessa artwork
            'activity' => new ActivityResource(Activity::find($model->pivot->activity_id ?? 0)), // Se estiver pegando essa artwork a partir de uma pessoa, activity é a atuação dessa pessoa nessa artwork

            'languages' => LanguageResource::collection($model->languages),
            'awards' => AwardResource::collection($model->awards),
            'dimensions' => $this->dimensions,
            'materials' => $this->materials,

            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }
}
