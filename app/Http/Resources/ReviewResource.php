<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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

            'categories' => CategoryResource::collection($this->categories),

            'activity' => new ActivityResource(Activity::find($this->pivot->activity_id ?? 0)), // Se estiver pegando essa artwork a partir de uma pessoa, activity é a atuação dessa pessoa nessa artwork

            'mentions' => $this->mentions(),

            'sources' => SourceResource::collection($this->whenLoaded('sources')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
