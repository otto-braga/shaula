<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Traits\HandlesFiles;
use App\Traits\ParsesUuids;
use App\Traits\SyncsAuthors;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Inertia\Inertia;

class ReviewController extends Controller
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
        $reviews = Review::latest()
            ->latest()
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

        $this->syncUuids($request->authors_uuids, $review->authors(), $this->syncAuthors(...));
        $this->syncUuids($request->categories_uuids, $review->categories());

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

        $this->syncUuids($request->authors_uuids, $review->authors(), $this->syncAuthors(...));
        $this->syncUuids($request->categories_uuids, $review->categories());

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
            $this->handleImageUpdate($request, $review);

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
            $this->handleContentUpdate($request, $review);

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
        $this->syncUuids($request->sources_uuids, $review->sources());

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
        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['reviews'],
            ])
        );
    }
}
