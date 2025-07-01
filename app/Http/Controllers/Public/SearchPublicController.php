<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Controllers\SearchController;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchPublicController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('search', [
            'q' => $request->q ?? null,
        ]);
    }

    public function fetchSearch(Request $request) {
        return (new SearchController())->fetchSearch($request);
    }

    public function fetchFilterOptions(Request $request) {
        return (new SearchController())->fetchFilterOptions($request);
    }
}
