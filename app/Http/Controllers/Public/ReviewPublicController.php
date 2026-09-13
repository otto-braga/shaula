<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ReviewResource;
use App\Models\Category;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReviewPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Review::query();

        $categoryRecord = null;
        if ($request->filled('category')) {
            $categorySlug = $request->query('category');

            if (Schema::hasColumn('categories', 'slug')) {
                $categoryRecord = Category::where('slug', $categorySlug)->first();
                $query->whereHas('categories', function ($q) use ($categorySlug) {
                    $q->where('categories.slug', $categorySlug);
                });
            } else {
                $categoryRecord = Category::all()->first(function ($cat) use ($categorySlug) {
                    return Str::slug($cat->name) === $categorySlug
                        || strtolower($cat->name) === strtolower($categorySlug);
                });

                if ($categoryRecord) {
                    $query->whereHas('categories', function ($q) use ($categoryRecord) {
                        $q->where('categories.id', $categoryRecord->id);
                    });
                } else {
                    $query->whereHas('categories', function ($q) use ($categorySlug) {
                        $q->where('categories.name', $categorySlug);
                    });
                }
            }
        }

        $reviews = $query->latest()
            ->paginate(8)
            ->withQueryString();

        $carouselReviews = Review::with(['authors', 'images'])
            ->latest()
            ->take(5)
            ->get();

        $catLimit = max(1, (int) $request->query('cat_limit', 10));
        $totalCategoriesCount = Category::count();

        $categories = Category::orderBy('name')->take($catLimit)->get();

        if ($categoryRecord && ! $categories->contains('id', $categoryRecord->id)) {
            $categories->push($categoryRecord);
            $categories = $categories->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)->values();
        }

        $authors = Person::whereHas('reviews', function ($query) {
            $query->where('is_author', true);
        })->get();

        return Inertia::render('review/index', [
            'reviews' => ReviewResource::collection($reviews),
            'lastReviews' => ReviewResource::collection($carouselReviews),
            'carouselReviews' => ReviewResource::collection($carouselReviews),
            'categories' => CategoryResource::collection($categories),
            'totalCategoriesCount' => $totalCategoriesCount,
            'filters' => [
                'category' => $request->query('category'),
                'search' => $request->query('search'),
                'cat_limit' => $request->query('cat_limit') ? (int) $request->query('cat_limit') : null,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {

        $review = Review::where('slug', $slug)->firstOrFail();

        return Inertia::render('review/show', [
            'review' => new ReviewResource($review),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}
