<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkResource;
use App\Models\Artwork;
use App\Models\Review;
use Inertia\Inertia;

class HomePublicController extends Controller
{
    public function index()
    {

        $lastReviews = Review::orderBy('created_at', 'desc')->take(3)->get();
        $lastArtworks = Artwork::orderBy('created_at', 'desc')->take(6)->get();

        return Inertia::render('index', [
            'lastReviews' => WorkResource::collection($lastReviews),
            'lastArtworks' => WorkResource::collection($lastArtworks)
        ]);
    }
}
