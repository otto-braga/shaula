<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\PeriodResource;
use App\Models\HistoryArticle;
use App\Models\Period;
use Inertia\Inertia;

class HistoryArticlePublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $historyArticles = HistoryArticle::with(['authors', 'images'])
            ->latest()
            ->take(5)
            ->get();

        $periods = Period::with(['images'])->get();

        return Inertia::render('historyArticle/index', [
            'historyArticles' => HistoryArticleResource::collection($historyArticles),
            'periods' => PeriodResource::collection($periods),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $historyArticle = HistoryArticle::where('slug', $slug)
            ->with([
                'authors',
                'images',
                'contentImages',
                'sources.file',
                'categories',
                'periods',
            ])
            ->firstOrFail();

        return Inertia::render('historyArticle/show', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }
}
