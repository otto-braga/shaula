<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\SearchResultResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
// use Meilisearch\Client;
// use Meilisearch\Contracts\MultiSearchFederation;
// use Meilisearch\Contracts\SearchQuery;

class SearchController extends Controller
{
    public function fetchSelectOptions(Request $request)
    {
        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => [
                    'people',
                    'artworks',
                    'reviews',
                    'history_articles',
                    'exhibits',
                ],
            ])
        );
    }

    public function fetchSearch(Request $request)
    {
        $query = $request->q !== null ? trim((string) $request->q) : null;
        $page = max(1, (int) ($request->page ?: 1));
        $page_size = max(1, (int) ($request->page_size ?? $request->limit ?? 5));

        $only = is_string($request->only)
            ? array_values(array_filter(explode(',', $request->only)))
            : ($request->only ?? []);

        $exclude = is_string($request->exclude)
            ? array_values(array_filter(explode(',', $request->exclude)))
            : ($request->exclude ?? []);

        $rawFilter = $request->filter;
        $filter = is_string($rawFilter) ? (json_decode($rawFilter, true) ?? []) : (is_array($rawFilter) ? $rawFilter : []);

        $indexes = config('search.index');
        $retval = [];
        $seenKeys = [];

        foreach ($indexes as $indexUid => $indexUidData) {
            $uid = $indexUidData['indexUid'] ?? '';

            if (count($only) > 0 && !in_array($uid, $only, true)) {
                continue;
            }

            if (count($exclude) > 0 && in_array($uid, $exclude, true)) {
                continue;
            }

            if (empty($indexUidData['searchableAttributes'])) {
                continue;
            }

            $modelQuery = $indexUid::query();

            if ($query !== null && $query !== '') {
                $searchableAttributes = $indexUidData['searchableAttributes'];
                $modelQuery->where(function ($subQuery) use ($searchableAttributes, $query) {
                    foreach ($searchableAttributes as $attribute) {
                        $subQuery->orWhere($attribute, 'like', '%' . $query . '%');
                    }
                });
            }

            $models = $modelQuery->get();

            foreach ($models as $result) {
                $item = $result->toSearchableArray();
                $item['_federation'] = [
                    'indexUid' => $uid,
                ];

                $uniqueKey = $uid . ':' . ($item['uuid'] ?? $item['id'] ?? spl_object_id($result));
                if (!isset($seenKeys[$uniqueKey])) {
                    $seenKeys[$uniqueKey] = true;
                    $retval[] = $item;
                }
            }
        }

        // Apply attribute filters (periods, categories, cities, etc.) if provided
        if (!empty($filter) && is_array($filter)) {
            $activeFilters = [];
            foreach ($filter as $filterItem) {
                if (is_array($filterItem) && !empty($filterItem['name']) && !empty($filterItem['value']) && is_array($filterItem['value'])) {
                    $activeFilters[$filterItem['name']] = array_values(array_filter($filterItem['value']));
                }
            }

            if (!empty($activeFilters)) {
                $retval = array_values(array_filter($retval, function ($item) use ($activeFilters) {
                    foreach ($activeFilters as $attrName => $selectedValues) {
                        if (empty($selectedValues)) {
                            continue;
                        }

                        $itemValues = $item[$attrName] ?? [];
                        if (!is_array($itemValues)) {
                            $itemValues = [$itemValues];
                        }

                        // Special case: Period model matched against 'periods' filter
                        if ($attrName === 'periods' && ($item['_federation']['indexUid'] ?? '') === 'periods' && !empty($item['name'])) {
                            $itemValues[] = $item['name'];
                        }

                        if (count(array_intersect($itemValues, $selectedValues)) === 0) {
                            return false;
                        }
                    }

                    return true;
                }));
            }
        }

        // Sort by updated_at desc
        usort($retval, function ($a, $b) {
            return ($b['updated_at'] ?? 0) <=> ($a['updated_at'] ?? 0);
        });

        $estimated_total_hits = count($retval);
        $last_page = max(1, (int) ceil($estimated_total_hits / $page_size));

        if ($page > $last_page) {
            $page = $last_page;
        }

        $offset = max(0, $page_size * ($page - 1));
        $retval = array_slice($retval, $offset, $page_size);

        return [
            'q' => $query,
            'results' => SearchResultResource::collection($retval),
            'total' => $estimated_total_hits,
            'last_page' => $last_page,
            'currentPage' => $page,
            'filter' => $filter,
        ];
    }

    public function fetchFilterOptions(Request $request)
    {
        $indexes = config('search.index', []);
        $filterableAttributes = [];

        foreach ($indexes as $indexUidData) {
            if (!empty($indexUidData['filterableAttributes']) && is_array($indexUidData['filterableAttributes'])) {
                foreach ($indexUidData['filterableAttributes'] as $attr) {
                    if (!in_array($attr, $filterableAttributes, true)) {
                        $filterableAttributes[] = $attr;
                    }
                }
            }
        }

        $labels = config('filterable_attributes', []);
        $filterOptions = [];

        foreach ($filterableAttributes as $attribute) {
            if (!Schema::hasTable($attribute) || !Schema::hasColumn($attribute, 'name')) {
                continue;
            }

            $values = DB::table($attribute)
                ->select('name')
                ->whereNotNull('name')
                ->where('name', '!=', '')
                ->orderBy('name')
                ->pluck('name')
                ->unique()
                ->values()
                ->toArray();

            if (empty($values)) {
                continue;
            }

            $filterOptions[] = [
                'name' => $attribute,
                'label' => $labels[$attribute] ?? ucfirst($attribute),
                'value' => $values,
            ];
        }

        return response()->json([
            'data' => $filterOptions,
        ]);
    }

    public function fetchMulti(Request $request)
    {
        return $this->fetchSearch($request);
    }

    // public function handleSearch(
    // ) {
    // }

    // public function _old_handleSearch(
    //     $client,
    //     $query,
    //     $federation,
    //     $request_filter,
    //     $onlyUids = [],
    //     $excludeUids = []
    // ) {
    //     // ---------------------------------------------------------------------
    //     // Filter example (uncomment to test):
    //     //
    //     // $filter['periods'] = [
    //     //     'periodo tempora',
    //     //     'periodo aut',
    //     // ];
    //     //
    //     // $filter['cities'] = [
    //     //     'cidade Saulmouth',
    //     // ];

    //     $filter = [];

    //     foreach ($request_filter as $item) {
    //         $filter[$item['name']] = is_array($item['value']) ? $item['value'] : [$item['value']];
    //     }

    //     $indexUids = config('scout.meilisearch.index-settings');
    //     $filterStrings = [];
    //     $hasFilter = false;

    //     foreach ($indexUids as $indexUid => $indexUidData) {
    //         // if (
    //         //     (count($onlyUids) > 0 && !in_array($indexUid, $onlyUids))
    //         //     && in_array($indexUid, $excludeUids)
    //         // ) {
    //         //     continue; // Skip excluded index UIDs
    //         // }

    //         $filterableAttributes = $indexUidData['filterableAttributes'];

    //         if (empty($filterableAttributes)) {
    //             continue; // Skip if no filterable attributes
    //         }

    //         foreach ($filterableAttributes as $attribute) {
    //             if (isset($filter[$attribute])) {
    //                 if (!isset($filterStrings[$indexUid])) {
    //                     $filterStrings[$indexUid] = '';
    //                 }

    //                 foreach ($filter[$attribute] as $value) {
    //                     $filterStrings[$indexUid] .= $attribute . ' = "' . $value . '" OR ';
    //                 }

    //                 $filterStrings[$indexUid] = rtrim($filterStrings[$indexUid], ' OR '); // Remove the last ' OR '
    //             }
    //         }
    //     }

    //     foreach ($filterStrings as $filterString) {
    //         if ($filterString != '') {
    //             $hasFilter = true;
    //             break;
    //         }
    //     }

    //     $multisearchQueries = [];

    //     foreach ($indexUids as $indexUid => $indexUidData) {
    //         if (
    //             (count($onlyUids) > 0 && !in_array($indexUid, $onlyUids))
    //             || in_array($indexUid, $excludeUids)
    //         ) {
    //             continue;
    //         }

    //         $filterString = $filterStrings[$indexUid] ?? '';

    //         if ($hasFilter && $filterString == '') {
    //             continue; // Skip if no filter for this index
    //         }

    //         $searchQuery = (new SearchQuery())
    //             ->setIndexUid($indexUid)
    //             ->setFilter([$filterString])
    //             ->setQuery($query)
    //             // order by updated_at desc
    //             ->setSort(['updated_at:desc']);

    //         array_push($multisearchQueries, $searchQuery);
    //     }


    //     return $client->multiSearch(
    //         $multisearchQueries,
    //         $federation
    //     );

    //     return $result;
    // }

    // public function _old_fetchFilterOptions(Request $request)
    // {
    //     $indexUids = config('scout.meilisearch.index-settings');
    //     $filterableAttributes = [];

    //     foreach ($indexUids as $indexUid => $indexUidData) {
    //         // Skip if index UID data does not have the key "filterableAttributes"
    //         if (!key_exists('filterableAttributes', $indexUidData)) {
    //             continue;
    //         }

    //         if (
    //             !isset($indexUidData['filterableAttributes'])
    //             || in_array($filterableAttributes, $indexUidData['filterableAttributes'])
    //         ) {
    //             continue; // Skip if already added
    //         }
    //         array_push($filterableAttributes, ...$indexUidData['filterableAttributes']);
    //     }

    //     $filterOptions = [];
    //     foreach ($filterableAttributes as $attribute) {
    //         // Skip if attribute is already in the options
    //         if (in_array($attribute, array_column($filterOptions, 'name'))) {
    //             continue;
    //         }

    //         $filterOptions[] = [
    //             'value' => DB::table($attribute)->select('name')->get()->pluck('name')->toArray(),
    //             'name' => $attribute,
    //             'label' => config("filterable_attributes")[$attribute] ?? $attribute,
    //         ];
    //     }

    //     return response()->json([
    //         'data' => $filterOptions,
    //     ]);
    // }

    // public function _old_fetchMulti(Request $request)
    // {
    //     $query = $request->q ?? null;
    //     $limit = $request->limit ?? ($request->page_size ?? 5);

    //     $only = $request->only ?? [];
    //     $exclude = $request->exclude ?? [];

    //     if ($query) {
    //         $client = new Client(
    //             config('scout.meilisearch.host'),
    //             config('scout.meilisearch.key')
    //         );

    //         $federation = new MultiSearchFederation();
    //         $federation
    //             ->setLimit($limit)
    //             ->setOffset(0);

    //         $results = $this->handleSearch(
    //             client: $client,
    //             query: $query,
    //             federation: $federation,
    //             request_filter: [],
    //             onlyUids: $only,
    //             excludeUids: $exclude
    //         );

    //         return response()->json([
    //             'results' => SearchResultResource::collection($results['hits']),
    //         ]);
    //     }
    // }

    // public function _old_fetchSearch(Request $request)
    // {
    //     $query = $request->q ?? '';
    //     $page = (int) $request->page ?? 1;
    //     $page_size = $request->page_size ?? 5;

    //     $only = $request->only ?? [];
    //     $exclude = $request->exclude ?? [];

    //     $filter = json_decode($request->filter, true) ?? [];

    //     $offset = $page_size * ($page - 1) < 0 ? 0 : $page_size * ($page - 1);

    //     // if ($query) {
    //         $client = new Client(
    //             config('scout.meilisearch.host'),
    //             config('scout.meilisearch.key')
    //         );

    //         $federation = new MultiSearchFederation();
    //         $federation
    //             ->setLimit($page_size)
    //             ->setOffset($offset);

    //         $results = $this->handleSearch(
    //             client: $client,
    //             query: $query,
    //             federation: $federation,
    //             request_filter: $filter,
    //             onlyUids: $only,
    //             excludeUids: $exclude
    //         );

    //         $estimated_total_hits = $results['estimatedTotalHits'];
    //         $last_page = intdiv($estimated_total_hits, $page_size);

    //         if ($page > $last_page) {
    //             $offset = $last_page * $page_size;
    //             $federation->setOffset($offset);
    //         }
    //     // }

    //     return [
    //         'q' => $query,
    //         'results' => SearchResultResource::collection($results['hits']),
    //         'total' => $estimated_total_hits,
    //         'last_page' => $last_page,
    //         'currentPage' => $page,
    //         'filter' => $filter,
    //     ];
    // }
}
