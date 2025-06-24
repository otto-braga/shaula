<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait HasMentions
{
    public function mentions()
    {
        $content = $this->content;

        if (empty($content) || !$content) {
            return [];
        }

        $hasMention = str_contains($content, '<span class="shaula-mention">');

        $mentions = [];
        $limit = 10000; // Limit to avoid infinite loop in case of malformed content

        while ($hasMention && $limit > 0) {
            $matches = [];
            $mention = preg_match('/<span class="shaula-mention">(.*?)<\/span>/s', $content, $matches) ? ($matches[1] ?? null) : null;

            if ($mention) {
                $type = preg_match('/data-type="(.*?)"/', $mention, $typeMatches) ? ($typeMatches[1] ?? null) : null;
                $uuid = preg_match('/data-key="([a-z0-9-]+)"/', $mention, $uuidMatches) ? ($uuidMatches[1] ?? null) : null;

                if ($uuid && $type) {
                    $model = DB::table($type)->where('uuid', $uuid)->first();

                    if ($model) {
                        $name = $model->name ?? $model->title ?? null;

                        if ($name) {
                            $mentions[] = [
                                'type' => $type,
                                'key' => $uuid,
                                'name' => $name,
                                'route' => route('public.' . $type . '.show', $model->slug),
                            ];
                        }
                    }
                }
            }

            $content = preg_replace('/<span class="shaula-mention">(.*?)<\/span>/s', '', $content, 1);
            $hasMention = str_contains($content, '<span class="shaula-mention">');
            $limit--;
        }

        return collect($mentions);
    }
}
