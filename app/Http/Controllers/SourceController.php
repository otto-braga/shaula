<?php

namespace App\Http\Controllers;

use App\Http\Resources\SourceResource;
use App\Models\Source;
use App\Models\SourceCategory;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\HasFile;
use App\Traits\HasMention;
use App\Traits\ParsesUuids;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SourceController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        HasCommonPaginationConstants;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        Gate::authorize('view', Source::class);

        $sources = Source::query()
            ->latest()
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/sources/index', [
            'sources' => SourceResource::collection($sources),
        ]);
    }

    public function show(Source $source)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        Gate::authorize('create', Source::class);

        return Inertia::render('admin/sources/edit/index');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Source::class);

        $dataForm = $request->all();

        $source = Source::create($dataForm);

        $this->syncUuids($request->source_categories_uuids, $source->sourceCategories());

        if ($request->has('files') && count($request->files) > 0) {
            if ($source->file) {
                $this->deleteFile($source->file->id);
            }
            $this->storeFile($request, $source, 'general');
            $source->file->update(['is_primary' => true]);
        }

        session()->flash('success', true);
        return redirect()->route('sources.edit', $source);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Source $source)
    {
        Gate::authorize('update', Source::class);

        return Inertia::render('admin/sources/edit/index', [
            'source' => new SourceResource($source),
        ]);
    }

    public function update(Request $request, Source $source)
    {
        Gate::authorize('update', Source::class);

        $dataForm = $request->all();

        $source->update($dataForm);

        $this->syncUuids($request->source_categories_uuids, $source->sourceCategories());

        if ($request->has('delete_file') && $request->delete_file) {
            if ($source->file) {
                $this->deleteFile($source->file->id);
            }
        }

        if ($request->has('files') && count($request->files) > 0) {
            if ($source->file) {
                $this->deleteFile($source->file->id);
            }
            $this->storeFile($request, $source, 'general');
        }

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Source $source)
    {
        Gate::authorize('delete', Source::class);

        $source->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchCategorySelectOptions(Request $request)
    {
        Gate::authorize('view', Source::class);

        $options = SourceCategory::fetchAsSelectOption($request->search);
        return response()->json($options);
    }

    public function fetchSingle($uuid)
    {
        Gate::authorize('view', Source::class);

        $source = Source::where('uuid', $uuid)->firstOrFail();
        return response()->json(new SourceResource($source));
    }

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', Source::class);

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['sources'],
            ])
        );
    }
}
