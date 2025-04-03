<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtworkResource;
use App\Http\Resources\WorkResource;
use App\Models\Artwork;
use App\Models\Work;
use Inertia\Inertia;

class ArtworkPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $artworks = Artwork::paginate(12);

        return Inertia::render('Artwork/Index', [
            'artworks' => WorkResource::collection($artworks)
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show($uuid)
    {
        $artwork = Work::where('uuid', $uuid)->firstOrFail();
        $artwork->load('workable');

        return Inertia::render('Artwork/Show', [
            'artwork' => new WorkResource($artwork)
        ]);
    }
}
