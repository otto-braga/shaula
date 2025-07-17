<?php

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/** * Trait UpdatesImages
 *
 * This trait handles the updating of images associated with a model.
 * It processes the request to update the images and manage file uploads.
 */
trait UpdatesImages
{
    /**
     * Handle the update of images associated with a model, including file management.
     *
     * @param Request $request
     * @param Model $model
     * @return void
     */
    protected function handleImageUpdate(Request $request, Model $model): void
    {
        if ($request->has('files') && count($request->files) > 0) {
            $this->storeFile($request, $model, 'general');
        }

        if ($request->has('files_to_remove') && count($request->files_to_remove) > 0) {
            foreach ($request->files_to_remove as $file_uuid) {
                $file_id = File::where('uuid', $file_uuid)->first()->id ?? null;
                if ($file_id) {
                    $this->deleteFile($file_id);
                }
            }
        }

        if ($model->images()->count() > 0) {
            $model->images()->update(['is_primary' => false]);
            if ($request->primary_image_uuid > 0) {
                $model->images()->where('uuid', $request->primary_image_uuid)->update(['is_primary' => true]);
            } else {
                $model->images()->first()->update(['is_primary' => true]);
            }
        }

        $model->save();
    }
}
