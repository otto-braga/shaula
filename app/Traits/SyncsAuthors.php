<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Relations\Relation;

/** * Trait SyncsAuthors
 *
 * This trait provides methods to sync an array of authors ids with the authors relation.
 * It ensures that the authors are correctly attached or detached based on the provided IDs.
 */
trait SyncsAuthors
{
    /**
     * Syncs the given array of authors IDs with the authors relation.
     *
     * @param array $authors_ids
     * @param Relation $authors_relation
     */
    protected function syncAuthors(array $authors_ids, Relation $authors_relation)
    {
        if (!is_array($authors_ids)) {
            return;
        }

        if (empty($authors_ids)) {
            $authors_relation->wherePivot('is_author', true)->detach();
            return;
        }

        foreach ($authors_relation->get() as $author) {
            if (!in_array($author->id, $authors_ids) && $author->pivot->is_author) {
                $authors_relation->detach($author->id);
            }
        }

        foreach ($authors_ids as $author_id) {
            if (!$authors_relation->get()->contains($author_id)) {
                $authors_relation->attach($author_id, ['is_author' => true]);
            }
        }
    }
}
