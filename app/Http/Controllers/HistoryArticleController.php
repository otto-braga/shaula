<?php

namespace App\Http\Controllers;

use App\Http\Requests\FetchRequest;
use App\Http\Requests\HistoryArticleEditRequest;
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

        $historyArticles = HistoryArticle::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('title', 'like', '%' . request()->q . '%');
                }
            })
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

    public function store(HistoryArticleEditRequest $request)
    {
        Gate::authorize('create', HistoryArticle::class);

        try {
            $request->validated();

            $historyArticle = HistoryArticle::create(
                $request->only([
                    'title',
                    'date',
                    'links',
                ])
            );

            $this->syncUuids($request->authors_uuids, $historyArticle->authors(), $this->syncAuthors(...));
            $this->syncUuids($request->categories_uuids, $historyArticle->categories());
            $this->syncUuids($request->periods_uuids, $historyArticle->periods());

            session()->flash('success', true);
            return redirect()->route('history_articles.edit', $historyArticle);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
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

    public function update(HistoryArticleEditRequest $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

        try {
            $request->validated();

            $historyArticle->update(
                $request->only([
                    'title',
                    'date',
                    'links',
                ])
            );

            $this->syncUuids($request->authors_uuids, $historyArticle->authors(), $this->syncAuthors(...));
            $this->syncUuids($request->categories_uuids, $historyArticle->categories());
            $this->syncUuids($request->periods_uuids, $historyArticle->periods());

            session()->flash('success', true);
            return redirect()->route('history_articles.edit', $historyArticle);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
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

    public function updateImages(HistoryArticleEditRequest $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

        try {
            $request->validated();

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

    public function updateContent(HistoryArticleEditRequest $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

        try {
            $request->validated();

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

    public function updateSources(HistoryArticleEditRequest $request, HistoryArticle $historyArticle)
    {
        Gate::authorize('update', HistoryArticle::class);

        try {
            $request->validated();

            $this->syncUuids($request->sources_uuids, $historyArticle->sources());

            $historyArticle->save();

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

    public function destroy(HistoryArticle $historyArticle)
    {
        Gate::authorize('delete', HistoryArticle::class);

        try {
            $historyArticle->delete();

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

    public function fetchSelectOptions(FetchRequest $request)
    {
        Gate::authorize('view', HistoryArticle::class);

        $request->validated();

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['history_articles'],
            ])
        );
    }
}
