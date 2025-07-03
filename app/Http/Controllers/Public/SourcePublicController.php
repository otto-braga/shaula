<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\PeriodResource;
use App\Models\HistoryArticle;
use App\Models\Period;
use App\Models\Source;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SourcePublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $historyArticles = HistoryArticle::get();

    //     $periods = Period::get();

    //     return Inertia::render('historyArticle/index', [
    //         'historyArticles' => HistoryArticleResource::collection($historyArticles),
    //         'periods' => PeriodResource::collection($periods),
    //     ]);
    // }

    /**
     * Display the specified resource.
     */
    public function show($slug) {
        $source = Source::where('slug', $slug)->firstOrFail();
        $source_file_url = $source->file ? asset(Storage::url($source->file->path)) : null;

        redirect()->to($source_file_url)->send();
    }
}
