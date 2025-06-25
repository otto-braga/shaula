<?php

namespace App\Traits;

trait HasSyncAuthors
{
    protected function syncAuthors($model, $authors_ids)
    {
        $model->authors()->syncWithoutDetaching($authors_ids, ['is_author' => true]);

        foreach ($model->authors as $author) {
            if (!in_array($author->id, $authors_ids)) {
                $model->authors()->detach($author->id);
            }
        }
    }
}
