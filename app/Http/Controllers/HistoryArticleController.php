<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\HistoryArticleResource;
use App\Models\HistoryArticle;
use App\Traits\HandlesFiles;
use App\Traits\ParsesUuids;
use App\Traits\SyncsAuthors;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Inertia\Inertia;

class HistoryArticleController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        SyncsAuthors,
        UpdatesImages,
        UpdatesContent;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $historyArticles = HistoryArticle::query()
            ->latest()
            ->get();

        return Inertia::render('admin/historyArticle/index', [
            'historyArticles' => HistoryArticleResource::collection($historyArticles),
        ]);
    }

    public function show(HistoryArticle $historyArticle)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        return Inertia::render('admin/historyArticle/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $historyArticle = HistoryArticle::create($dataForm);

        $this->syncUuids($request->authors_uuids, $historyArticle->authors(), $this->syncAuthors(...));
        $this->syncUuids($request->categories_uuids, $historyArticle->categories());
        $this->syncUuids($request->periods_uuids, $historyArticle->periods());

        session()->flash('success', true);
        return redirect()->route('history_articles.edit', $historyArticle);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(HistoryArticle $historyArticle)
    {
        $historyArticle->load('authors');

        return Inertia::render('admin/historyArticle/edit/index', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function update(Request $request, HistoryArticle $historyArticle)
    {
        $dataForm = $request->all();

        $historyArticle->update($dataForm);

        $this->syncUuids($request->authors_uuids, $historyArticle->authors(), $this->syncAuthors(...));
        $this->syncUuids($request->categories_uuids, $historyArticle->categories());
        $this->syncUuids($request->periods_uuids, $historyArticle->periods());

        session()->flash('success', true);
        return redirect()->route('history_articles.edit', $historyArticle);
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(HistoryArticle $historyArticle)
    {
        return Inertia::render('admin/historyArticle/edit/images', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateImages(Request $request, HistoryArticle $historyArticle)
    {
        try {
            $this->handleImageUpdate($request, $historyArticle);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CONTENT

    public function editContent(HistoryArticle $historyArticle)
    {
        return Inertia::render('admin/historyArticle/edit/content', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateContent(Request $request, HistoryArticle $historyArticle)
    {
        try {
            $this->handleContentUpdate($request, $historyArticle);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT SOURCES

    public function editSources(HistoryArticle $historyArticle)
    {
        $historyArticle->load('sources');

        return Inertia::render('admin/historyArticle/edit/sources', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateSources(Request $request, HistoryArticle $historyArticle)
    {
        $this->syncUuids($request->sources_uuids, $historyArticle->sources());

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(HistoryArticle $historyArticle)
    {
        $historyArticle->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['history_articles'],
            ])
        );
    }
}
