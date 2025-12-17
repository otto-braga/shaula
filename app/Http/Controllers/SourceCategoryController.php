<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuxEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\SourceCategoryResource;
use App\Models\SourceCategory;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Support\Facades\Gate;

class SourceCategoryController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', SourceCategory::class);

        $souceCategories = SourceCategory::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/sourceCategories/index', [
            'sourceCategories' => SourceCategoryResource::collection($souceCategories),
        ]);
    }

    public function store(AuxEditRequest $request)
    {
        Gate::authorize('create', SourceCategory::class);

        try {
            $request->validated();

            SourceCategory::create($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(AuxEditRequest $request, SourceCategory $sourceCategory)
    {
        Gate::authorize('update', SourceCategory::class);

        try {
            $request->validated();

            $sourceCategory->update($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }

    }

    public function destroy(SourceCategory $sourceCategory)
    {
        Gate::authorize('delete', SourceCategory::class);

        try {
            $sourceCategory->delete();

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
        Gate::authorize('view', SourceCategory::class);

        $request->validated();

        return SourceCategory::fetchAsSelectOptions($request->q);
    }
}
