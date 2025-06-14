<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\PeriodResource;
use App\Models\HistoryArticle;
use App\Models\Period;
use Inertia\Inertia;

class PeriodPublicController extends Controller
{

    public function index()
    {
        $historyArticles = HistoryArticle::take(3)->get();

        $periods = Period::get();

        return Inertia::render('historyArticle/index', [
            'historyArticles' => HistoryArticleResource::collection($historyArticles),
            'periods' => PeriodResource::collection($periods),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Period $period)
    {

        $period->load('historyArticles');

        return Inertia::render('period/show', [
            'period' => new PeriodResource($period)
        ]);
    }
}
