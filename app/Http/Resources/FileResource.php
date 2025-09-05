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
            // 'id' => $this->id,
            'uuid' => $this->uuid,

            'name' => $this->name,
            'original_name' => $this->original_name,
            'mime_type' => $this->mime_type,
            // 'path' => Storage::disk('s3')->url($this->path),
            'path' => asset(Storage::url($this->path)),

            'collection' => $this->collection,
            'size' => $this->size,

            'is_primary' => $this->is_primary,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
