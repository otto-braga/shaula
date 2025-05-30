<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'route' => $this['route'] ?? null,
            'name' => $this['name'] ?? null,
            'title' => $this['title'] ?? null,
            'authors' => $this['authors'] ?? null,
            'content' => $this['content'] ?? null,
        ];
    }
}
