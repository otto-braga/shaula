<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SourceResource extends JsonResource
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

            'files' => FileResource::collection($this->files),
            'primary_file' => new FileResource($this->primaryFile()),
            'images' => FileResource::collection($this->images),
            'primary_image' => new FileResource($this->primaryImage()),
            'content_images' => FileResource::collection($this->contentImages),

            'categories' => CategoryResource::collection($this->categories),
            'periods' => PeriodResource::collection($this->periods),

            'mentioned' => MentionResource::collection($this->whenLoaded('mentioned')),
            'mentioners' => MentionResource::collection($this->whenLoaded('mentioners')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
