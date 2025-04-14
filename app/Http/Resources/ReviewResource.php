<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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

            'title' => $this->title,
            'date' => $this->date,
            'authors' => PersonResource::collection($this->authors),
            'content' => $this->content,
            'files' => FileResource::collection($this->files),
            'images' => FileResource::collection($this->images),
            'general_images' => FileResource::collection($this->generalImages),
            'content_images' => FileResource::collection($this->contentImages),
            'categories' => CategoryResource::collection($this->categories),
            'tags' => TagResource::collection($this->tags),

            'activity' => new ActivityResource(Activity::find($this->pivot->activity_id ?? 0)), // Se estiver pegando essa artwork a partir de uma pessoa, activity é a atuação dessa pessoa nessa artwork

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
