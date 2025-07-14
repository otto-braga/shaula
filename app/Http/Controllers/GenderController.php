<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuxEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\GenderResource;
use App\Models\Gender;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class GenderController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Gender::class);

        $genders = Gender::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/genders/index', [
            'genders' => GenderResource::collection($genders),
        ]);
    }

    public function store(AuxEditRequest $request)
    {
        Gate::authorize('create', Gender::class);

        try {
            $request->validated();

            Gender::create($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(AuxEditRequest $request, Gender $gender)
    {
        Gate::authorize('update', Gender::class);

        try {
            $request->validated();

            $gender->update($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(Gender $gender)
    {
        Gate::authorize('delete', Gender::class);

        try {
            $gender->delete();

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
        Gate::authorize('view', Gender::class);

        $request->validated();

        return Gender::fetchAsSelectOptions($request->q);
    }
}
