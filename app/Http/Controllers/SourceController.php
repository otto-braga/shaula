<?php

namespace App\Http\Controllers;

use App\Http\Requests\FetchRequest;
use App\Http\Requests\SourceEditRequest;
use App\Http\Resources\SourceResource;
use App\Models\Source;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\ParsesUuids;
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

        $sources = Source::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('title', 'like', '%' . request()->q . '%');
                }
            })
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

    public function store(SourceEditRequest $request)
    {
        Gate::authorize('create', Source::class);

        try {
            $request->validated();

            $source = Source::create(
                $request->only([
                    'title',
                    'content',
                ])
            );

            if ($request->has('files') && count($request->files) > 0) {

                if ($source->file != null) {
                    $this->deleteFile($source->file->id);
                }

                $this->storeFile($request, $source, 'general');
            }

            session()->flash('success', true);
            return redirect()->route('sources.edit', $source);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
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

    public function update(SourceEditRequest $request, Source $source)
    {
        Gate::authorize('update', Source::class);

        try {
            $request->validated();

            $source->update(
                $request->only([
                    'title',
                    'content',
                ])
            );

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
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Source $source)
    {
        Gate::authorize('delete', Source::class);

        try {
            $source->delete();

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

    public function fetchSingle($uuid)
    {
        Gate::authorize('view', Source::class);

        $source = Source::where('uuid', $uuid)->firstOrFail();
        return response()->json(new SourceResource($source));
    }

    public function fetchSelectOptions(FetchRequest $request)
    {
        Gate::authorize('view', Source::class);

        $request->validated();

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['sources'],
            ])
        );
    }
}
