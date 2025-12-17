<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'type' => $this['type'],
            'key' => $this['key'],
            'name' => $this['name'],
            'route' => $this['route'],
        ];
    }








    protected function castMentioner($resource)
    {
        $retval = null;

        foreach (config('mention_types') as $mentionType) {
            if ($resource->mentioner_type === $mentionType['type']) {
                $retval = new $mentionType['resource']($resource->mentioner);
                break;
            }
        }

        return $retval;
    }

    protected function castMentioned($resource)
    {
        $retval = null;

        foreach (config('mention_types') as $mentionType) {
            if ($resource->mentioned_type === $mentionType['type']) {
                $retval = new $mentionType['resource']($resource->mentioned);
                break;
            }
        }

        return $retval;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    // public function toArray(Request $request): array
    // {
    //     return [
    //         'id' => $this->id,

    //         'mentioner_id' => $this->mentioner_id,
    //         'mentioner_type' => $this->mentioner_type,
    //         'mentioner_name' => $this->mentioner->title ?? $this->mentioner->name,
    //         // 'mentioner' => $this->castMentioner($this),

    //         'mentioned_id' => $this->mentioned_id,
    //         'mentioned_type' => $this->mentioned_type,
    //         'mentioned_name' => $this->mentioned->title ?? $this->mentioned->name,
    //         // 'mentioned' => $this->castMentioned($this),

    //         'created_at' => $this->created_at,
    //         'updated_at' => $this->updated_at,
    //     ];
    // }
}
