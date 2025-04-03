<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class FileResource extends JsonResource
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

            'name' => $this->name,
            'original_name' => $this->original_name,
            'mime_type' => $this->mime_type,
            'path' => asset(Storage::url($this->path)),

            'collection' => $this->collection,
            'size' => $this->size,

            'is_primary' => $this->is_primary,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // 'lastModified' => $this->updated_at->diffForHumans(),
            // 'lastModifiedDate' => $this->updated_at->timestamp,

            // 'type' => $this->type,
            // 'webkitRelativePath' => $this->path,
        ];
    }
}
