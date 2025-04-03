<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkResource extends JsonResource
{
    public function castResource($resource)
    {

        return match ($resource->workable_type) {
            'App\Models\Artwork' => new ArtworkResource($resource->workable),
            'App\Models\Review' => new ReviewResource($resource->workable),
            // 'App\Models\Source' => new SourceResource($resource->workable),
            // 'App\Models\Curation' => new CurationResource($resource->workable),
            // 'App\Models\Exhibit' => new ExhibitResource($resource->workable),
            default => null,
        };
    }


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
            'date_end' => $model->date_end,
            'description' => $model->description,
            'content' => $model->content,

            'work_type' => $model->workable_type,
            'workable' => $this->castResource($model),

            'files' => FileResource::collection($model->files),
            'images' => FileResource::collection($model->images),
            'general_images' => FileResource::collection($model->generalImages),
            'content_images' => FileResource::collection($model->contentImages),

            'authors' => PersonResource::collection($model->authors),
            'people' => PersonResource::collection($model->people),

            'cities' => CityResource::collection($model->cities),
            'languages' => LanguageResource::collection($model->languages),
            'awards' => AwardResource::collection($model->awards),
            'categories' => CategoryResource::collection($model->categories),
            'tags' => TagResource::collection($model->tags),

            // 'mentioners' => MentionResource::collection($model->mentioners),
            // 'mentions' => MentionResource::collection($model->mentions),

            // Se estiver pegando o work a partir de uma pessoa, activity é a atuação dessa pessoa no work
            'activity' => new ActivityResource(Activity::find($model->pivot->activity_id ?? 0)),
            // Todas as atividades do work
            'activities' => ActivityResource::collection($model->activities()),

            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }
}
