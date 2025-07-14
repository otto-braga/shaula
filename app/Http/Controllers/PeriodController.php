<?php

namespace App\Http\Controllers;

use App\Http\Requests\FetchRequest;
use App\Http\Requests\PeriodEditRequest;
use App\Http\Resources\PeriodResource;
use App\Models\Period;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\ParsesUuids;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
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

    public function store(PeriodEditRequest $request)
    {
        Gate::authorize('create', Period::class);

        try {
            $request->validated();

            $period = Period::create(
                $request->only([
                    'name',
                    'start_date',
                    'end_date',
                ])
            );

            session()->flash('success', true);
            return redirect()->route('periods.edit', $period);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
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

    public function update(PeriodEditRequest $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        try {
            $request->validated();

            $period->update(
                $request->only([
                    'name',
                    'start_date',
                    'end_date',
                ])
            );

            session()->flash('success', true);
            return redirect()->route('periods.edit', $period);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
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

    public function updateImages(PeriodEditRequest $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        try {
            $request->validated();

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

    public function updateContent(PeriodEditRequest $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        try {
            $request->validated();

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

    public function updateSources(PeriodEditRequest $request, Period $period)
    {
        Gate::authorize('update', Period::class);

        try {
            $request->validated();

            $this->syncUuids($request->sources_uuids, $period->sources());

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Period $period)
    {
        Gate::authorize('delete', Period::class);

        try {
            $period->delete();

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(FetchRequest $request)
    {
        Gate::authorize('view', Period::class);

        $request->validated();

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['periods'],
            ])
        );
    }
}
