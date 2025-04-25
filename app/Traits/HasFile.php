<?php

namespace App\Traits;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HasFile
{
    protected function storeFile(Request $request, $fileable, $collection)
    {
        $directory = 'files/' . class_basename($fileable) . '/' . $fileable->uuid;

        $validated = $request->validate([
            "files.*" => "required|mimes:jpeg,jpg,png",
        ]);

        $storeDirectory = $directory . '/' . $collection;

        $uploadedFilesIds = [];

        foreach ($validated['files'] as $file) {
            $filePath = $file->store($storeDirectory, 'public');

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

    protected function deleteFile($fileId)
    {
        $file = File::find($fileId);

        if ($file) {
            Storage::disk('public')->delete($file->path);
            $file->delete();
        }
    }
}
