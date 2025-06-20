<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Traits\HasFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use HasFile;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $reviews = Review::latest()
            ->get();

        return Inertia::render('admin/review/index', [
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }

    public function show(Review $review)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        return Inertia::render('admin/review/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $review = Review::create($dataForm);

        $review->authors()->sync($request->authors_ids);
        $review->categories()->sync($request->categories_ids);

        session()->flash('success', true);
        return redirect()->route('reviews.edit', $review);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Review $review)
    {
        $review->load('authors');

        return Inertia::render('admin/review/edit/index', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function update(Request $request, Review $review)
    {
        $dataForm = $request->all();

        $review->update($dataForm);

        $review->authors()->sync($request->authors_ids);
        $review->categories()->sync($request->categories_ids);

        session()->flash('success', true);
        return redirect()->route('reviews.edit', $review);
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Review $review)
    {
        return Inertia::render('admin/review/edit/images', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function updateImages(Request $request, Review $review)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $review, 'general');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            if ($review->images()->count() > 0) {
                $review->images()->update(['is_primary' => false]);
                if ($request->primaryImageId > 0) {
                    $review->images()->where('id', $request->primaryImageId)->update(['is_primary' => true]);
                } else {
                    $review->images()->first()->update(['is_primary' => true]);
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

    public function editContent(Review $review)
    {
        return Inertia::render('admin/review/edit/content', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function updateContent(Request $request, Review $review)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $review, 'content');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $review->update(['content' => $request->content]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT SOURCES

    public function editSources(Review $review)
    {
        $review->load('sources');

        return Inertia::render('admin/review/edit/sources', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function updateSources(Request $request, Review $review)
    {
        $review->sources()->sync($request->sources_ids);

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Review $review)
    {
        $review->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        $options = Review::fetchAsSelectOption($request->search);
        return response()->json($options);
    }
}
