<?php

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/** * Trait UpdatesContent
 *
 * This trait handles the updating of content associated with a model.
 * It processes the request to update the content and manage files.
 */
trait UpdatesContent
{
    /**
     * Handle the update of content associated with a model, including file management.
     *
     * @param Request $request
     * @param Model $model
     * @return void
     */
    protected function handleContentUpdate(Request $request, Model $model): void
    {
        if ($request->has('files') && count($request->files) > 0) {
            $this->storeFile($request, $model, 'content');
        }

        if ($request->has('files_to_remove') && count($request->files_to_remove) > 0) {
            foreach ($request->files_to_remove as $file_uuid) {
                $file_id = File::where('uuid', $file_uuid)->first()->id ?? null;
                if ($file_id) {
                    $this->deleteFile($file_id);
                }
            }
        }

        $model->update(['content' => $request->content]);
    }
}
