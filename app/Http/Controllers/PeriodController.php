<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeriodResource;
use App\Models\Period;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\ParsesUuids;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PeriodController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        UpdatesImages,
        UpdatesContent,
        HasCommonPaginationConstants;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        Gate::authorize('view', Period::class);

        $periods = Period::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->latest()
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/period/index', [
            'periods' => PeriodResource::collection($periods),
        ]);
    }

    public function show(Period $period)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        Gate::authorize('create', Period::class);

        return Inertia::render('admin/period/edit/index');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Period::class);

        $dataForm = $request->all();

        $period = Period::create($dataForm);

        session()->flash('success', true);
        return redirect()->route('periods.edit', $period);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Period $period)
    {
        Gate::authorize('update', Period::class);

        return Inertia::render('admin/period/edit/index', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function update(Request $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        $dataForm = $request->all();

        $period->update($dataForm);

        session()->flash('success', true);
        return redirect()->route('periods.edit', $period);
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Period $period)
    {
        Gate::authorize('update', Period::class);

        return Inertia::render('admin/period/edit/images', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateImages(Request $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        try {
            $this->handleImageUpdate($request, $period);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CONTENT

    public function editContent(Period $period)
    {
        Gate::authorize('update', Period::class);

        return Inertia::render('admin/period/edit/content', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateContent(Request $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        try {
            $this->handleContentUpdate($request, $period);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT SOURCES

    public function editSources(Period $period)
    {
        Gate::authorize('update', Period::class);

        $period->load('sources');

        return Inertia::render('admin/period/edit/sources', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateSources(Request $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        $this->syncUuids($request->sources_uuids, $period->sources());

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Period $period)
    {
        Gate::authorize('delete', Period::class);

        $period->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', Period::class);

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['periods'],
            ])
        );
    }
}
