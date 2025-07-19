<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardLatestResource;
use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Award;
use App\Models\Category;
use App\Models\City;
use App\Models\Gender;
use App\Models\HistoryArticle;
use App\Models\Language;
use App\Models\Period;
use App\Models\Person;
use App\Models\Review;
use App\Models\Source;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getLatestItems($model, $label)
    {
        return $model::orderBy('updated_at', 'desc')
            ->take(2)
            ->get(['uuid', 'slug', $label . ' as label', 'created_at', 'updated_at'])
            ->map(function ($item) use ($model) {
                return array_merge($item->toArray(), ['route' => route($model->getTable() . '.edit', $item->slug)]);
            });
    }

    private function getLatestItemsAux($model, $label)
    {
        return $model::orderBy('updated_at', 'desc')
            ->take(2)
            ->get(['uuid', $label . ' as label', 'created_at', 'updated_at'])
            ->map(function ($item) use ($model) {
                return array_merge($item->toArray(), ['route' => $model->getTable()]);
            });
    }

    public function index(Request $request)
    {
        $latest = [];
        $indexes = [
            Person::class,
            Artwork::class,
            Review::class,
            Period::class,
            HistoryArticle::class,
            Source::class,
        ];

        foreach ($indexes as $key => $index) {
            $model = new $index;

            if (in_array('name', $model->getFillable())) {
                $latest[$key] = $this->getLatestItems($model, 'name');
            }
            elseif (in_array('title', $model->getFillable())) {
                $latest[$key] = $this->getLatestItems($model, 'title');
            }
            elseif (in_array('label', $model->getFillable())) {
                $latest[$key] = $this->getLatestItems($model, 'label');
            }
            else {
                continue;
            }
        }

        $latest_merged = [];
        for ($i = 1; $i < count($latest); $i++) {
            if (!is_array($latest[$i - 1]) || !is_array($latest[$i])) {
                continue;
            }
            $merged = $latest[$i]->merge($latest[$i - 1]);
            $latest_merged = array_merge($latest_merged, $merged->toArray());
        }
        $latest_merged = collect($latest_merged)
            ->unique('label')
            ->sortByDesc('updated_at')->take(10)->values()->all();

        $latest_aux = [];
        $indexes_aux = [
            Gender::class,
            Activity::class,
            City::class,
            Language::class,
            Category::class,
            Award::class,
        ];

        foreach ($indexes_aux as $key => $index) {
            $model = new $index;

            if (in_array('name', $model->getFillable())) {
                $latest_aux[$key] = $this->getLatestItemsAux($model, 'name');
            }
            elseif (in_array('title', $model->getFillable())) {
                $latest_aux[$key] = $this->getLatestItemsAux($model, 'title');
            }
            elseif (in_array('label', $model->getFillable())) {
                $latest_aux[$key] = $this->getLatestItemsAux($model, 'label');
            }
            else {
                continue;
            }
        }

        $latest_aux_merged = [];
        for ($i = 1; $i < count($latest_aux); $i++) {
            $merged = $latest_aux[$i]->merge($latest_aux[$i - 1]);
            $latest_aux_merged = array_merge($latest_aux_merged, $merged->toArray());
        }
        $latest_aux_merged = collect($latest_aux_merged)
            ->unique('label')
            ->sortByDesc('updated_at')->take(10)->values()->all();

        return Inertia::render('admin/dashboard', [
            'latest' => DashboardLatestResource::collection($latest_merged),
            'latest_aux' => DashboardLatestResource::collection($latest_aux_merged),
            'q' => $request->q ?? '',
        ]);
    }
}
