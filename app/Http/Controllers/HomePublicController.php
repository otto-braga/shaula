<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArtworkResource;
use App\Http\Resources\ReviewResource;
use App\Models\Artwork;
use App\Models\Review;
use Inertia\Inertia;

class HomePublicController extends Controller
{
    public function index()
    {

        $reviews = Review::latest()->take(3)->get();
        $artworks = Artwork::latest()->take(6)->get();

        return Inertia::render('index', [
            'reviews' => ReviewResource::collection($reviews),
            'artworks' => ArtworkResource::collection($artworks)
        ]);
    }
}
