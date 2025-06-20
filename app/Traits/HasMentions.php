<?php

namespace App\Traits;

use Illuminate\Support\Facades\Schema;

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
            $mentions[] = preg_match('/<span class="shaula-mention">(.*?)<\/span>/s', $content, $matches) ? ($matches[1] ?? null) : null;

            $content = preg_replace('/<span class="shaula-mention">(.*?)<\/span>/s', '', $content, 1);
            $hasMention = str_contains($content, '<div id="shaula-mention">');
            $limit--;
        }

        return $mentions;
    }
}
