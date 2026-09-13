<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtworkResource;
use App\Models\Artwork;
use Inertia\Inertia;

class ArtworkPublicController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $artwork = Artwork::where('slug', $slug)->firstOrFail();
        $artwork->load([
            'images',
            'authors',
            'categories',
            'periods',
            'sources',
            'languages',
            'awards',
        ]);

        return Inertia::render('artwork/show', [
            'artwork' => new ArtworkResource($artwork)
        ]);
    }
}
