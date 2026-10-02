<?php

namespace App\Http\Controllers;

use App\Http\Requests\AboutUpdateRequest;
use App\Http\Resources\AboutResource;
use App\Models\About;
use App\Models\File;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    use HasFile;

    /**
     * Display the public About page.
     */
    public function show(): Response
    {
        $about = About::current();
        $about->load('coverImage');

        return Inertia::render('about/index', [
            'about' => new AboutResource($about),
        ]);
    }

    /**
     * Show the dedicated form for editing the About page.
     */
    public function edit(): Response
    {
        Gate::authorize('update', About::class);

        $about = About::current();
        $about->load('coverImage');

        return Inertia::render('admin/about/edit', [
            'about' => new AboutResource($about),
        ]);
    }

    /**
     * Update the rich text content and cover image of the About page.
     */
    public function update(AboutUpdateRequest $request): RedirectResponse
    {
        Gate::authorize('update', About::class);

        try {
            $about = About::current();
            $about->load('coverImage');

            $about->update([
                'title' => $request->filled('title') ? $request->input('title') : ($about->title ?: 'Sobre o Shaula'),
                'content' => $request->input('content', ''),
            ]);

            // Handle removal of existing cover image if requested
            $filesToRemove = (array) $request->input('files_to_remove', []);
            $shouldRemoveCover = $request->boolean('remove_cover_image') ||
                ($about->coverImage && in_array($about->coverImage->uuid, $filesToRemove));

            if ($shouldRemoveCover && $about->coverImage) {
                $this->deleteFile($about->coverImage->id);
            }

            // Handle new cover image upload
            if ($request->hasFile('cover_image')) {
                // Delete previous cover image if present
                $about->load('coverImage');
                if ($about->coverImage) {
                    $this->deleteFile($about->coverImage->id);
                }

                $file = $request->file('cover_image');
                $directory = 'files/About/' . $about->uuid . '/cover';
                $filePath = $file->store($directory);

                File::create([
                    'fileable_id' => $about->id,
                    'fileable_type' => About::class,
                    'name' => $file->hashName(),
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'path' => $filePath,
                    'collection' => 'cover',
                    'size' => $file->getSize(),
                    'is_primary' => true,
                    'is_temporary' => false,
                ]);
            } elseif ($request->hasFile('files') && count($request->file('files')) > 0) {
                // Delete previous cover image if present
                $about->load('coverImage');
                if ($about->coverImage) {
                    $this->deleteFile($about->coverImage->id);
                }

                $this->storeFile($request, $about, 'cover');

                // Mark the newly created file as primary
                $about->load('coverImage');
                if ($about->coverImage) {
                    $about->coverImage->update(['is_primary' => true]);
                }
            }

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back()->withErrors([
                'error' => 'Ocorreu um erro ao atualizar a página Sobre: ' . $e->getMessage(),
            ]);
        }
    }
}
