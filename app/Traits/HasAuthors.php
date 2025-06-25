<?php

namespace App\Traits;

use App\Models\Person;

trait HasAuthors
{
    protected function updateAuthors($model, $authors_uuids)
    {
        $authors_ids = [];
        foreach ($authors_uuids as $author_uuid) {
            $author = Person::where('uuid', $author_uuid)->first();
            if ($author) {
                $authors_ids[] = $author->id;
            }
        }

        $model->authors()->syncWithoutDetaching($authors_ids, ['is_author' => true]);

        foreach ($model->authors as $author) {
            if (!in_array($author->id, $authors_ids)) {
                $model->authors()->detach($author->id);
            }
        }
    }
}
