<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArtworkResource;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\ReviewResource;
use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

class HomePublicController extends Controller
{
    public function index(): Response
    {
        $reviews = Review::with(['authors', 'images'])
            ->latest()
            ->take(3)
            ->get();

        $historyArticles = HistoryArticle::with(['authors', 'images'])
            ->latest()
            ->take(3)
            ->get();

        $artworks = Artwork::with(['authors', 'images'])
            ->inRandomOrder()
            ->take(6)
            ->get();

        return Inertia::render('index', [
            'reviews' => ReviewResource::collection($reviews),
            'historyArticles' => HistoryArticleResource::collection($historyArticles),
            'artworks' => ArtworkResource::collection($artworks),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('about/index');
    }
}
