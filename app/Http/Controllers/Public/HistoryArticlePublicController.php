<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HistoryArticleResource;
use App\Models\HistoryArticle;
use Inertia\Inertia;

class HistoryArticlePublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get the last 3 reviews
        $historyArticles = HistoryArticle::get();

        return Inertia::render('historyArticle/index', [
            'historyArticles' => HistoryArticleResource::collection($historyArticles),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {

        $historyArticles = HistoryArticle::where('slug', $slug)->firstOrFail();

        return Inertia::render('historyArticle/show', [
            'historyArticle' => new HistoryArticleResource($historyArticles),
        ]);
    }
}
