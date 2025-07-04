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
use Carbon\Carbon;
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

        if ($request->has('date')) {
            $date_exploded = explode('T', $request->date, 2);
            $date = $date_exploded[0];
            $timezone = $date_exploded[1] ?? 'UTC';
            $hour = '14:20:00'; // Default hour if not provided

            $date = $date . 'T' . $hour; // Combine date and hour

            $date_UTC = Carbon::parse($date, $timezone)->toISOString();

            $date_back_to_local = Carbon::parse($date_UTC, 'UTC')
                ->setTimezone($timezone)
                ->toDateTimeLocalString();

            // $date_back_to_local = Carbon::parse($date_UTC, $timezone);

            $date_sao_paulo = Carbon::parse($date_UTC, 'UTC')
                ->setTimezone('America/Sao_Paulo');

            dd(
                'Original date:', $date,
                // 'Date in local timezone:', $date_local,
                'Date in UTC:', $date_UTC,
                'Date back to local timezone:', $date_back_to_local,
                'Date in Sao Paulo timezone:', $date_sao_paulo
            );
        }

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
