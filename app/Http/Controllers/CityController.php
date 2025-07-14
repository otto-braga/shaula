<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuxEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\CityResource;
use App\Models\City;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CityController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', City::class);

        $cities = City::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/cities/index', [
            'cities' => CityResource::collection($cities),
        ]);
    }

    public function store(AuxEditRequest $request)
    {
        Gate::authorize('create', City::class);

        try {
            $request->validated();

            City::create($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(AuxEditRequest $request, City $city)
    {
        Gate::authorize('update', City::class);

        try {
            $request->validated();

            $city->update($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(City $city)
    {
        Gate::authorize('delete', City::class);

        try {
            $city->delete();

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
        Gate::authorize('view', City::class);

        $request->validated();

        return City::fetchAsSelectOptions($request->q);
    }
}
