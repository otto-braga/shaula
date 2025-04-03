<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkResource;
use App\Models\Review;
use Inertia\Inertia;

class HomePublicController extends Controller
{
    public function index()
    {

        $lastReviews = Review::orderBy('created_at', 'desc')->take(3)->get();
        $lastArtworks = Review::orderBy('created_at', 'desc')->take(6)->get();

        return Inertia::render('welcome', [
            'lastReviews' => WorkResource::collection($lastReviews),
            'lastArtworks' => WorkResource::collection($lastArtworks)
        ]);
    }
}
