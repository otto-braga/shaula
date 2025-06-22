<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Public\SearchPublicController;
use App\Http\Resources\SearchResultResource;
use App\Http\Resources\SourceResource;
use App\Models\Source;
use App\Models\SourceCategory;
use App\Traits\HasFile;
use App\Traits\HasMention;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SourceController extends Controller
{
    use HasFile, HasMention;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $sources = Source::query()
            ->orderBy('created_at', 'desc')
            ->get();

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
        return Inertia::render('admin/sources/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $source = Source::create($dataForm);

        $source->update($dataForm);

        $source->sourceCategories()->sync($request->source_categories_ids);

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
        return Inertia::render('admin/sources/edit/index', [
            'source' => new SourceResource($source),
        ]);
    }

    public function update(Request $request, Source $source)
    {
        $dataForm = $request->all();

        $source->update($dataForm);

        $source->sourceCategories()->sync($request->source_categories_ids);

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
        $source->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchCategorySelectOptions(Request $request)
    {
        $options = SourceCategory::fetchAsSelectOption($request->search);
        return response()->json($options);
    }

    public function fetchSingle($uuid)
    {
        $source = Source::where('uuid', $uuid)->firstOrFail();
        return response()->json(new SourceResource($source));
    }

    public function fetchSelectOptions(Request $request)
    {
        return SearchPublicController::fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['sources'],
            ])
        );
    }
}
