<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewEditRequest;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\ParsesUuids;
use App\Traits\SyncsAuthors;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ReviewController extends Controller
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
        Gate::authorize('view', Review::class);

        $reviews = Review::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('title', 'like', '%' . request()->q . '%');
                }
            })
            ->latest()
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

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
        Gate::authorize('create', Review::class);

        return Inertia::render('admin/review/edit/index');
    }

    public function store(ReviewEditRequest $request)
    {
        Gate::authorize('create', Review::class);

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
        Gate::authorize('update', Review::class);

        $review->load('authors');

        return Inertia::render('admin/review/edit/index', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function update(ReviewEditRequest $request, Review $review)
    {
        Gate::authorize('update', Review::class);

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
        Gate::authorize('update', Review::class);

        return Inertia::render('admin/review/edit/images', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function updateImages(ReviewEditRequest $request, Review $review)
    {
        Gate::authorize('update', Review::class);

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
        Gate::authorize('update', Review::class);

        return Inertia::render('admin/review/edit/content', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function updateContent(ReviewEditRequest $request, Review $review)
    {
        Gate::authorize('update', Review::class);

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
        Gate::authorize('update', Review::class);

        $review->load('sources');

        return Inertia::render('admin/review/edit/sources', [
            'review' => new ReviewResource($review),
        ]);
    }

    public function updateSources(ReviewEditRequest $request, Review $review)
    {
        Gate::authorize('update', Review::class);

        $this->syncUuids($request->sources_uuids, $review->sources());

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Review $review)
    {
        Gate::authorize('delete', Review::class);

        $review->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', Review::class);

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['reviews'],
            ])
        );
    }
}
