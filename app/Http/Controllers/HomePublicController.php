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

        $reviews = Review::latest()->take(3)->get();
        $artworks = Artwork::latest()->take(6)->get();

        return Inertia::render('index', [
            'reviews' => WorkResource::collection($reviews),
            'artworks' => WorkResource::collection($artworks)
        ]);
    }
}
