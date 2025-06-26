<?php

namespace App\Traits;

trait HasSyncAuthors
{
    protected function syncAuthors($model, $authors_ids)
    {
        if (!is_array($authors_ids)) {
            return;
        }

        if (empty($authors_ids)) {
            $model->authors()->wherePivot('is_author', true)->detach();
            return;
        }

        foreach ($model->authors as $author) {
            if (!in_array($author->id, $authors_ids) && $author->pivot->is_author) {
                $model->authors()->detach($author->id);
            }
        }

        foreach ($authors_ids as $author_id) {
            if (!$model->authors->contains($author_id)) {
                $model->authors()->attach($author_id, ['is_author' => true]);
            }
        }
    }
}
