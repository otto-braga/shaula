<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Artwork;
use App\Models\HistoryArticle;
use App\Models\Person;
use App\Models\Review;
use App\Models\Source;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request['search'];
        $results = [];

        if ($query) {

            $historyArticlesQuery = HistoryArticle::with('authors')
                ->where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            foreach ($historyArticlesQuery as $historyArticle) {
                $results[] = [
                    'title' => $historyArticle->title,
                    'authors' => $historyArticle->authors,
                    'date' => $historyArticle->date,
                    'type' => 'Artigo'
                ];
            }

            $reviewsQuery = Review::with('authors')
                ->where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            foreach ($reviewsQuery as $review) {
                $results[] = [
                    'title' => $review->title,
                    'authors' => $review->authors,
                    'date' => $review->date,
                    'type' => 'Crítica'
                ];
            }

            $artworksQuery = Artwork::with('authors')
                ->where('title', 'like', '%' . $query . '%')
                ->orWhere('content', 'like', '%' . $query . '%')
                ->get();

            foreach ($artworksQuery as $artwork) {
                $results[] = [
                    'title' => $artwork->title,
                    'authors' => $artwork->authors,
                    'date' => $artwork->date,
                    'type' => 'Obra'
                ];
            }
        }

        return Inertia::render('search', [
            'query' => $query,
            'results' => $results,
        ]);
    }

    public function search(Request $request)
    {
        $key = $request->key;

        $results = [];

        foreach (config('searchable_types') as $searchable_type) {
            $model = $searchable_type['type'];
            $results[] = $model::search($key);
        }

        $retval = $results[0];

        foreach ($results as $key => $result) {
            if ($key == 0) {
                continue;
            }
            $retval = $retval->union($result);
        }

        $retval = $retval->orderBy('title')->simplePaginate(15);

        return response()->json($retval);
    }
}
