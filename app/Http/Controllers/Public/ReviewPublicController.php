<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkResource;
use App\Models\Review;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::all();

        return Inertia::render('Review/Index', [
            'reviews' => WorkResource::collection($reviews),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($uuid)
    {

        
        $review = Work::where('uuid', $uuid)->firstOrFail();
        $review->load('workable');
        
        return Inertia::render('Review/Show', [
            'review' => new WorkResource($review),
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
