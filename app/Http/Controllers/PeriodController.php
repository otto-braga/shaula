<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeriodResource;
use App\Models\Period;
use App\Traits\HandlesFiles;
use App\Traits\ParsesUuids;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        UpdatesImages,
        UpdatesContent;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $periods = Period::query()
            ->latest()
            ->get();

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
        return Inertia::render('admin/period/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $period = Period::create($dataForm);

        session()->flash('success', true);
        return redirect()->route('periods.edit', $period);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Period $period)
    {
        return Inertia::render('admin/period/edit/index', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function update(Request $request, Period $period)
    {
        $dataForm = $request->all();

        $period->update($dataForm);

        session()->flash('success', true);
        return redirect()->route('periods.edit', $period);
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Period $period)
    {
        return Inertia::render('admin/period/edit/images', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateImages(Request $request, Period $period)
    {
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
        return Inertia::render('admin/period/edit/content', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateContent(Request $request, Period $period)
    {
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
        $period->load('sources');

        return Inertia::render('admin/period/edit/sources', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateSources(Request $request, Period $period)
    {
        $this->syncUuids($request->sources_uuids, $period->sources());

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Period $period)
    {
        $period->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['periods'],
            ])
        );
    }
}
