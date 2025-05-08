<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ReviewPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Faz a busca paginada e separa os resultados
        // do paginação. Isso é feito para que 
        // o scroll infinito funcione. No momomento desta
        // implementação Inertia::merge(para dar merge na pagination
        // e resultados da query) não está funcionando.
        // Para tutorial: https://laracasts.com/series/inertia-2-unleashed/episodes/5?autoplay=true


        $reviews = Review::latest()
            ->filter(Request::only('search'))
            ->paginate(4)
            ->withQueryString();

        $lastReviews = Review::latest()
            ->take(3)
            ->get();

        return Inertia::render('review/index', [
            // 'reviews' => Inertia::merge($reviews->items()),
            'reviews' => ReviewResource::collection($reviews->items()),
            'pagination' => Arr::except($reviews->toArray(), 'data'),
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
            'mentioned',
            'mentioners',
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
