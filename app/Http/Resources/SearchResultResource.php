<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SearchResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image_path = $this['primary_image_path'] ?? null;
        return [
            'type' => $this['_federation']['indexUid'] ?? null,
            'route' => $this['route'] ?? null,
            'name' => $this['name'] ?? null,
            'title' => $this['title'] ?? null,
            'authors' => $this['authors'] ?? null,
            'content' => $this['content'] ?? null,
            'primary_image_path' => $image_path ?? null,
            'primary_image_url' => asset(Storage::url($image_path)) ?? null,
        ];
    }
}
