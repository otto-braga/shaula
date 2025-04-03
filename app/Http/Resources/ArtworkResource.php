<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkResource extends JsonResource
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
            // 'title' => $this->title,
            // 'content' => $this->work->content,
            // 'work' => new WorkResource($this->work),
            'dimensions' => $this->dimensions,
            'materials' => $this->materials,
            'is_museumized' => $this->is_museumized ? true : false,
        ];
    }
}
