<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ReviewPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = Review::query();

        $reviews = $query->latest()
            ->filter(Request::only('search'))
            ->paginate(12)
            ->withQueryString();

        $lastReviews = Review::latest()
            ->take(3)
            ->get();

        $authors = Person::whereHas('reviews', function ($query) {
            $query->where('is_author', true);
        })->get();


        return Inertia::render('review/index', [
            'reviews' => ReviewResource::collection($reviews),
            'lastReviews' => ReviewResource::collection($lastReviews),
            'filters' => Request::all('search'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {

        $review = Review::where('slug', $slug)->firstOrFail();

        $review->load([
            'mentioned'
        ]);

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
