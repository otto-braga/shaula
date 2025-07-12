<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\HistoryArticleResource;
use App\Models\HistoryArticle;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\ParsesUuids;
use App\Traits\SyncsAuthors;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HistoryArticleController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        SyncsAuthors,
        UpdatesImages,
        UpdatesContent,
        HasCommonPaginationConstants;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        Gate::authorize('view', HistoryArticle::class);

        $historyArticles = HistoryArticle::query()
            ->latest()
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

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
        Gate::authorize('create', HistoryArticle::class);

        return Inertia::render('admin/historyArticle/edit/index');
    }

    public function store(Request $request)
    {
        Gate::authorize('create', HistoryArticle::class);

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
        Gate::authorize('update', HistoryArticle::class);

        $historyArticle->load('authors');

        return Inertia::render('admin/historyArticle/edit/index', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function update(Request $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

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
        Gate::authorize('update', HistoryArticle::class);

        return Inertia::render('admin/historyArticle/edit/images', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateImages(Request $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

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
        Gate::authorize('update', HistoryArticle::class);

        return Inertia::render('admin/historyArticle/edit/content', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateContent(Request $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

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
        Gate::authorize('update', HistoryArticle::class);

        $historyArticle->load('sources');

        return Inertia::render('admin/historyArticle/edit/sources', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateSources(Request $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

        $this->syncUuids($request->sources_uuids, $historyArticle->sources());

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(HistoryArticle $historyArticle)
    {
        Gate::authorize('delete', HistoryArticle::class);

        $historyArticle->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', HistoryArticle::class);

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['history_articles'],
            ])
        );
    }
}
