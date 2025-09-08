<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/** * Trait HasFiles
 *
 */
trait HasFiles
{
    protected static function bootHasFiles()
    {
        static::deleting(function (Model $model) {
            // Assuming the model has a 'file_path' attribute
            if ($model->files && $model->files->count() > 0) {
                foreach ($model->files as $file) {
                    Storage::disk()->delete($file->path);
                    $file->delete();
                }
            }
        });
    }
}
