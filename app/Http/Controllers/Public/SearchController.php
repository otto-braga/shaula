<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request['search'];
        $results = [];

        if ($query) {
            //serch for name or term in content for review, history article and artwork
            $results['reviews'] = Review::where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            $results['historyArticles'] = HistoryArticle::where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            $results['artworks'] = Artwork::where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();
        }

        return Inertia::render('search', [
            'query' => $query,
            'results' => $results,
        ]);
    }
}
