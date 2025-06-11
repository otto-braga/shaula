<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SearchResultResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $filter = json_decode($request->filter, true) ?? [];

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

            $result = $this->handleSearch($client, $query, $federation, $filter);

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
            'filter' => $filter,
        ];
    }

    public function handleSearch($client, $query, $federation, $request_filter)
    {
        // ---------------------------------------------------------------------
        // Filter example (uncomment to test):
        //
        // $filter['periods'] = [
        //     'periodo tempora',
        //     'periodo aut',
        // ];
        //
        // $filter['cities'] = [
        //     'cidade Saulmouth',
        // ];

        $filter = [];

        foreach ($request_filter as $item) {
            $filter[$item['name']] = is_array($item['value']) ? $item['value'] : [$item['value']];
        }

        // dd($filter);

        $indexUids = config('scout.meilisearch.index-settings');
        $filterStrings = [];
        $hasFilter = false;

        foreach ($indexUids as $indexUid => $indexUidData) {
            $filterableAttributes = $indexUidData['filterableAttributes'];

            if (empty($filterableAttributes)) {
                continue; // Skip if no filterable attributes
            }

            foreach ($filterableAttributes as $attribute) {
                if (isset($filter[$attribute])) {
                    if (!isset($filterStrings[$indexUid])) {
                        $filterStrings[$indexUid] = '';
                    }

                    foreach ($filter[$attribute] as $value) {
                        $filterStrings[$indexUid] .= $attribute . ' = "' . $value . '" OR ';
                    }

                    $filterStrings[$indexUid] = rtrim($filterStrings[$indexUid], ' OR '); // Remove the last ' OR '
                }
            }
        }

        foreach ($filterStrings as $filterString) {
            if ($filterString != '') {
                $hasFilter = true;
                break;
            }
        }

        $multisearchQueries = [];

        foreach ($indexUids as $indexUid => $indexUidData) {
            $filterString = $filterStrings[$indexUid] ?? '';

            if ($hasFilter && $filterString == '') {
                continue; // Skip if no filter for this index
            }

            $searchQuery = (new SearchQuery())
                ->setIndexUid($indexUid)
                ->setFilter([$filterString])
                ->setQuery($query);

            array_push($multisearchQueries, $searchQuery);
        }


        return $client->multiSearch(
            $multisearchQueries,
            $federation
        );

        return $result;
    }

    public function fetchFilterOptions(Request $request)
    {
        $indexUids = config('scout.meilisearch.index-settings');
        $filterableAttributes = [];

        foreach ($indexUids as $indexUid => $indexUidData) {
            if (
                !isset($indexUidData['filterableAttributes'])
                || in_array($filterableAttributes, $indexUidData['filterableAttributes'])
            ) {
                continue; // Skip if already added
            }
            array_push($filterableAttributes, ...$indexUidData['filterableAttributes']);
        }

        $filterOptions = [];
        foreach ($filterableAttributes as $attribute) {
            // Skip if attribute is already in the options
            if (in_array($attribute, array_column($filterOptions, 'name'))) {
                continue;
            }

            $filterOptions[] = [
                'value' => DB::table($attribute)->select('name')->get()->pluck('name')->toArray(),
                'name' => $attribute,
                'label' => config("filterable_attributes")[$attribute] ?? $attribute,
            ];
        }

        return response()->json([
            'data' => $filterOptions,
        ]);
    }

    public function fetchSelectOptions(Request $request)
    {
        $query = $request->q ?? null;
        $page_size = $request->page_size ?? 5;
        $filter = $request->filter ?? null;

        if ($query) {
            $client = new Client(
                config('scout.meilisearch.host'),
                config('scout.meilisearch.key')
            );

            $federation = new MultiSearchFederation();
            $federation
                ->setLimit($page_size)
                ->setOffset(0);

            $result = $this->handleSearch($client, $query, $federation, []);

            $options = [];

            foreach ($result['hits'] as $hit) {
                $options[] = [
                    'value' => $hit['id'] ?? '',
                    'label' => $hit['name'] ?? $hit['title'] ?? '',
                    // 'id' => $hit['id'] ?? null,
                    'type' => $hit['_federation']['indexUid'] ?? '',
                ];
            }

            return response()->json([
                'options' => $options,
            ]);
        }

        return response()->json([]);
    }

    public function redirectMention(Request $request)
    {
        $type = $request->type ?? null;
        $id = (int) $request->id;

        $model = DB::table($type)->find($id);

        if ($model) {
            return redirect()->route('public.' . $type . '.show', $model->slug);
        }

        // return redirect()->route('public.search.index', ['q' => $query]);
    }
}
