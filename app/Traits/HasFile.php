<?php

namespace App\Traits;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/** * Trait HasFile
 *
 * This trait provides methods to handle file uploads and deletions for controllers of models that can have files.
 * It includes methods to store files, validate them, and delete them.
 */
trait HasFile
{
    /** * Store files uploaded in the request for a given fileable model and collection.
     *
     * @param Request $request
     * @param mixed $fileable The model that can have files (e.g., Post, User).
     * @param string $collection The collection name where files will be stored.
     * @return array The IDs of the uploaded files.
     */
    protected function storeFile(Request $request, $fileable, $collection)
    {
        $directory = 'files/' . class_basename($fileable) . '/' . $fileable->uuid;

        $validated = $request->validate([
            "files.*" => "required|mimes:jpeg,jpg,png",
        ]);

        $storeDirectory = $directory . '/' . $collection;

        $uploadedFilesIds = [];

        foreach ($validated['files'] as $file) {
            $filePath = $file->store($storeDirectory, 's3');

            $uploadedFile = File::create(
                [
                    'fileable_id' => $fileable->id,
                    'fileable_type' => get_class($fileable),
                    'name' => $file->hashName(),
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'path' => $filePath,
                    'collection' => $collection,
                    'size' => $file->getSize(),
                    'is_temporary' => true,
                ]
            );

            $uploadedFile->save();

            array_push($uploadedFilesIds, $uploadedFile->id);
        }

        return $uploadedFilesIds;
    }

    /** * Delete a file by its ID.
     *
     * @param int $fileId The ID of the file to delete.
     * @return void
     */
    protected function deleteFile($fileId)
    {
        $file = File::find($fileId);

        if ($file) {
            Storage::disk('s3')->delete($file->path);
            $file->delete();
        }
    }
}
