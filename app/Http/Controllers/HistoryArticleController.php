<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\HistoryArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PeriodResource;
use App\Http\Resources\PersonResource;
use App\Models\HistoryArticle;
use App\Models\Category;
use App\Models\Period;
use App\Models\Person;
use App\Traits\HasFile;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class HistoryArticleController extends Controller
{
    use HasFile;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $historyArticles = HistoryArticle::query()
            ->orderBy('created_at', 'desc')
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
        $people = Person::query()
            ->orderBy('name')
            ->get();

        $categories = Category::all();
        $periods = Period::all();

        $periods = Period::all();

        return Inertia::render('admin/historyArticle/edit/index', [
            'people' => PersonResource::collection($people),
            'categories' => CategoryResource::collection($categories),
            'periods' => PeriodResource::collection($periods),
        ]);
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $historyArticle = HistoryArticle::create($dataForm);

        $historyArticle->authors()->syncWithPivotValues(
            Arr::pluck($request->authors, 'id'),
            ['is_author' => true]
        );
        $historyArticle->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->route('historyArticle.edit', $historyArticle->slug);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(HistoryArticle $historyArticle)
    {
        $historyArticle->load('authors');

        $people = Person::query()
            ->orderBy('name')
            ->get();

        $categories = Category::all();
        $periods = Period::all();

        $periods = Period::all();

        return Inertia::render('admin/historyArticle/edit/index', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
            'people' => PersonResource::collection($people),
            'categories' => CategoryResource::collection($categories),
            'periods' => PeriodResource::collection($periods),
        ]);
    }

    public function update(Request $request, HistoryArticle $historyArticle)
    {
        $dataForm = $request->all();

        $historyArticle->update($dataForm);

        $historyArticle->authors()->syncWithPivotValues(
            Arr::pluck($request->authors, 'id'),
            ['is_author' => true]
        );
        $historyArticle->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->back();
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
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $historyArticle, 'general');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            if ($historyArticle->images()->count() > 0) {
                $historyArticle->images()->update(['is_primary' => false]);
                if ($request->primaryImageId > 0) {
                    $historyArticle->images()->where('id', $request->primaryImageId)->update(['is_primary' => true]);
                } else {
                    $historyArticle->images()->first()->update(['is_primary' => true]);
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

    public function editContent(HistoryArticle $historyArticle)
    {
        return Inertia::render('admin/historyArticle/edit/content', [
            'historyArticle' => new HistoryArticleResource($historyArticle),
        ]);
    }

    public function updateContent(Request $request, HistoryArticle $historyArticle)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $historyArticle, 'content');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $historyArticle->update(['content' => $request->content]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(HistoryArticle $historyArticle)
    {
        $historyArticle->delete();

        session()->flash('success', true);
        return redirect()->back();
    }
}
