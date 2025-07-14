<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuxEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\AwardResource;
use App\Models\Award;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Support\Facades\Gate;

class AwardController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Award::class);

        $awards = Award::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/awards/index', [
            'awards' => AwardResource::collection($awards),
        ]);
    }

    public function store(AuxEditRequest $request)
    {
        Gate::authorize('create', Award::class);

        try {
            $request->validated();

            Award::create($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(AuxEditRequest $request, Award $award)
    {
        Gate::authorize('update', Award::class);

        try {
            $request->validated();

            $award->update($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(Award $award)
    {
        Gate::authorize('delete', Award::class);

        try {
            $award->delete();

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
        Gate::authorize('view', Award::class);

        $request->validated();

        return Award::fetchAsSelectOptions($request->q);
    }
}
