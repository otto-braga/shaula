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
            'uuid' => $this->uuid,
            'slug' => $this->slug,

            'title' => $this->title,
            'date' => $this->date,
            'authors' => PersonResource::collection($this->whenLoaded('authors', function () { return $this->authors->unique('id'); }, $this->authors->unique('id'))),
            'content' => $this->content,

            'images' => FileResource::collection($this->images),
            'primary_image' => $this->primaryImage() ? new FileResource($this->primaryImage()) : null,
            'content_images' => FileResource::collection($this->contentImages),

            'sources' => SourceResource::collection($this->sources),

            'pivot' => [
                'activity' => $this->pivot && $this->pivot->activity_id ? new ActivityResource(Activity::find($this->pivot->activity_id)) : null,
                'is_author' => $this->pivot ? (bool) $this->pivot->is_author : false,
            ],

            'categories' => CategoryResource::collection($this->categories),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
