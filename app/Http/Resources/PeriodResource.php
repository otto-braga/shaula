<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeriodResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // 'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,

            'name' => $this->name,
            'content' => $this->content,

            'images' => FileResource::collection($this->images),
            'primary_image' => new FileResource($this->primaryImage()),
            'content_images' => FileResource::collection($this->contentImages),

            'mentions' => MentionResource::collection($this->mentions()),
            'sources' => SourceResource::collection($this->sources),

            'history_articles' => HistoryArticleResource::collection($this->whenLoaded('historyArticles')),

            'start_date' => $this->start_date,
            'end_date' => $this->end_date,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
