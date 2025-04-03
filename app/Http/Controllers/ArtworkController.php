<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkResource;
use App\Models\Artwork;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $artworks = Artwork::all();

        return Inertia::render('Admin/Artwork/Index', [
            'artworks' => WorkResource::collection($artworks),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $uuid)
    {
        $artwork = Work::where('uuid', $uuid)->first()->workable;

        if ($artwork instanceof Artwork) {
            $artwork->update($request->all());
        }

        return redirect()->back()->with('success', 'true');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Artwork $artwork)
    {
        //
    }
}
