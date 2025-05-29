<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\PeriodResource;
use App\Models\Period;
use Inertia\Inertia;

class PeriodPublicController extends Controller
{
    public function index()
    {
        // $historyArticles = HistoryArticle::query()
        //     ->latest()
        //     ->get();

        $periods = Period::latest()
            ->paginate(9);

        return Inertia::render('period/index', [
            // 'historyArticles' => HistoryArticleResource::collection($historyArticles),
            'periods' => PeriodResource::collection($periods),
        ]);
    }
}
