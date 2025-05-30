<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SearchResultResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Meilisearch\Client;
use Meilisearch\Contracts\MultiSearchFederation;
use Meilisearch\Contracts\SearchQuery;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('search', [
            'q' => $request->q ?? null,
        ]);
    }

    public function fetch(Request $request)
    {
        $retval = $this->search($request);

        return response()->json([
            'q' => $retval['q'],
            'result' => SearchResultResource::collection($retval['result']),
            'total' => $retval['total'],
            'last_page' => $retval['last_page'],
            'currentPage' => $retval['currentPage'],
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->q ?? null;
        $page = (int) $request->page ?? 1;
        $page_size = $request->page_size ?? 5;

        $offset = $page_size * ($page - 1) < 0 ? 0 : $page_size * ($page - 1);
        $result = ['hits' => []];

        if ($query) {
            $client = new Client(
                config('scout.meilisearch.host'),
                config('scout.meilisearch.key')
            );

            $federation = new MultiSearchFederation();
            $federation
                ->setLimit($page_size)
                ->setOffset($offset);

            $result = $client->multiSearch(
                [
                    (new SearchQuery())
                        ->setIndexUid('artworks')
                        ->setQuery($query),
                    (new SearchQuery())
                        ->setIndexUid('people')
                        ->setQuery($query),
                    (new SearchQuery())
                        ->setIndexUid('reviews')
                        ->setQuery($query),
                    (new SearchQuery())
                        ->setIndexUid('history_articles')
                        ->setQuery($query),
                ],
                $federation
            );

            $estimated_total_hits = $result['estimatedTotalHits'];
            $last_page = intdiv($estimated_total_hits, $page_size);

            if ($page > $last_page) {
                $offset = $last_page * $page_size;
                $federation->setOffset($offset);
            }
        }

        return [
            'q' => $query,
            'result' => SearchResultResource::collection($result['hits']),
            'total' => $estimated_total_hits,
            'last_page' => $last_page,
            'currentPage' => $page,
        ];
    }

    public function fetchSelectOptions(Request $request)
    {
        $query = $request->q ?? null;
        $page_size = $request->page_size ?? 5;

        if ($query) {
            $client = new Client(
                config('scout.meilisearch.host'),
                config('scout.meilisearch.key')
            );

            $federation = new MultiSearchFederation();
            $federation
                ->setLimit($page_size)
                ->setOffset(0);

            $result = $client->multiSearch(
                [
                    (new SearchQuery())
                        ->setIndexUid('artworks')
                        ->setQuery($query),
                    (new SearchQuery())
                        ->setIndexUid('people')
                        ->setQuery($query),
                    (new SearchQuery())
                        ->setIndexUid('reviews')
                        ->setQuery($query),
                    (new SearchQuery())
                        ->setIndexUid('history_articles')
                        ->setQuery($query),
                ],
                $federation
            );

            $options = [];

            foreach ($result['hits'] as $hit) {
                $options[] = [
                    'value' => $hit['route'] ?? '',
                    'label' => $hit['name'] ?? $hit['title'] ?? '',
                ];
            }

            return response()->json([
                'options' => $options,
            ]);
        }

        return response()->json([]);
    }
}
