<?php

namespace App\Http\Controllers;

use App\Http\Resources\SourceResource;
use App\Models\Mention;
use App\Models\Source;
use App\Traits\HasFile;
use App\Traits\HasMention;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
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

        $source->authors()->syncWithPivotValues(
            $request->authors_ids,
            ['is_author' => true]
        );

        $source->categories()->sync($request->categories_ids);
        $source->periods()->sync($request->periods_ids);

        session()->flash('success', true);
        return redirect()->route('sources.edit', $source);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Source $source)
    {
        $source->load('authors');

        return Inertia::render('admin/sources/edit/index', [
            'source' => new SourceResource($source),
        ]);
    }

    public function update(Request $request, Source $source)
    {
        $dataForm = $request->all();

        $source->update($dataForm);

        $source->authors()->syncWithPivotValues(
            $request->authors_ids,
            ['is_author' => true]
        );

        $source->categories()->sync($request->categories_ids);
        $source->periods()->sync($request->periods_ids);

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Source $source)
    {
        return Inertia::render('admin/sources/edit/images', [
            'source' => new SourceResource($source),
        ]);
    }

    public function updateImages(Request $request, Source $source)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $source, 'general');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            if ($source->images()->count() > 0) {
                $source->images()->update(['is_primary' => false]);
                if ($request->primaryImageId > 0) {
                    $source->images()->where('id', $request->primaryImageId)->update(['is_primary' => true]);
                } else {
                    $source->images()->first()->update(['is_primary' => true]);
                }
            }

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CONTENT

    public function editContent(Source $source)
    {
        return Inertia::render('admin/sources/edit/content', [
            'source' => new SourceResource($source),
        ]);
    }

    public function updateContent(Request $request, Source $source)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $source, 'content');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $source->update(['content' => $request->content]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT MENTIONS

    public function editMentions(Source $source)
    {
        $source->load('mentioned');

        $mentionQueries = $this->getMentionQueries();

        return Inertia::render('admin/sources/edit/mentions', [
            'source' => new SourceResource($source),
            'mention_queries' => new JsonResource($mentionQueries),
        ]);
    }

    public function updateMentions(Request $request, Source $source)
    {
        $source->mentioned()->delete();

        foreach ($request->mentions as $mention) {
            Mention::create([
                'mentioned_id' => $mention['mentioned_id'],
                'mentioned_type' => $mention['mentioned_type'],
                'mentioner_id' => $source->id,
                'mentioner_type' => $source::class
            ]);
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

    public function fetchSelectOptions(Request $request)
    {
        $options = Source::fetchAsSelectOption($request->search);
        return response()->json($options);
    }
}
