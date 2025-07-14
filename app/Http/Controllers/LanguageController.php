<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuxEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\LanguageResource;
use App\Models\Language;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LanguageController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Language::class);

        $languages = Language::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('name', 'like', '%' . request()->q . '%');
                }
            })
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/languages/index', [
            'languages' => LanguageResource::collection($languages),
        ]);
    }

    public function store(AuxEditRequest $request)
    {
        Gate::authorize('create', Language::class);

        try {
            $request->validated();

            Language::create($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function update(AuxEditRequest $request, Language $language)
    {
        Gate::authorize('update', Language::class);

        try {
            $request->validated();

            $language->update($request->only('name'));

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Exception $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    public function destroy(Language $language)
    {
        Gate::authorize('delete', Language::class);

        try {
            $language->delete();

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
        Gate::authorize('view', Language::class);

        $request->validated();

        return Language::fetchAsSelectOptions($request->q);
    }
}
