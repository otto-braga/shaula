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
            'content' => $this->content,
            'source_categories' => new JsonResource($this->sourceCategories),
            'file' => new FileResource($this->file),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
