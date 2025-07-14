<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuxEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ActivityController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Activity::class);

        $activities = Activity::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/activities/index', [
            'activities' => ActivityResource::collection($activities),
        ]);
    }

    public function store(AuxEditRequest $request)
    {
        Gate::authorize('create', Activity::class);

        try {
            $request->validated();

            Activity::create($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(AuxEditRequest $request, Activity $activity)
    {
        Gate::authorize('update', Activity::class);

        try {
            $request->validated();

            $activity->update($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(Activity $activity)
    {
        Gate::authorize('delete', Activity::class);

        try {
            $activity->delete();

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(FetchRequest $request)
    {
        Gate::authorize('view', Activity::class);

        $request->validated();

        return Activity::fetchAsSelectOptions($request->q);
    }
}
