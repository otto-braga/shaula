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
    public function search(Request $request)
    {
        $query = $request->q ?? null;
        $page = $request->page ?? 1;
        $page_size = $request->page_size ?? 5;
        $offset = $page_size * ($page - 1);
        $estimated_total_hits = $request->total ?? null;
        $last_page = $request->last_page ?? null;
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
                ],
                $federation
            );

            if ($estimated_total_hits == null) {
                $estimated_total_hits = $result['estimatedTotalHits'];
                $last_page = intdiv($estimated_total_hits, $page_size);

                if ($page > $last_page) {
                    $offset = $last_page * $page_size;
                    $federation->setOffset($offset);
                }

                $result = $client->multiSearch(
                    [
                        (new SearchQuery())
                            ->setIndexUid('artworks')
                            ->setQuery($query),
                        (new SearchQuery())
                            ->setIndexUid('people')
                            ->setQuery($query),
                    ],
                    $federation
                );
            }
        }

        // dd($result);

        return Inertia::render('search', [
            'q' => $query,
            'result' => SearchResultResource::collection($result['hits']),
            'total' => $estimated_total_hits,
            'last_page' => $last_page,
            'currentPage' => $page,
        ]);

    }

    public function fetch(Request $request)
    {
        $query = $request->q ?? null;
        $page = (int) $request->page ?? 1;
        $page_size = $request->page_size ?? 5;
        $offset = $page_size * ($page - 1);
        $estimated_total_hits = $request->total ?? null;
        $last_page = $request->last_page ?? null;
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
                ],
                $federation
            );

            if ($estimated_total_hits == null) {
                $estimated_total_hits = $result['estimatedTotalHits'];
                $last_page = intdiv($estimated_total_hits, $page_size);

                if ($page > $last_page) {
                    $offset = $last_page * $page_size;
                    $federation->setOffset($offset);
                }

                $result = $client->multiSearch(
                    [
                        (new SearchQuery())
                            ->setIndexUid('artworks')
                            ->setQuery($query),
                        (new SearchQuery())
                            ->setIndexUid('people')
                            ->setQuery($query),
                    ],
                    $federation
                );
            }
        }

        return response()->json([
            'q' => $query,
            'result' => SearchResultResource::collection($result['hits']),
            'total' => $estimated_total_hits,
            'last_page' => $last_page,
            'currentPage' => $page,
        ]);
    }
}
