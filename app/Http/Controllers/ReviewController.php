<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PersonResource;
use App\Models\Activity;
use App\Models\Review;
use App\Models\Category;
use App\Models\Person;
use App\Traits\HasFile;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use HasFile;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $reviews = Review::query()
            ->orderBy('created_at', 'desc')
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
        $people = Person::query()
            ->orderBy('name')
            ->get();

        $categories = Category::all();

        return Inertia::render('admin/review/edit/index', [
            'people' => PersonResource::collection($people),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $review = Review::create($dataForm);

        $review->authors()->syncWithPivotValues(
            Arr::pluck($dataForm['authors'], 'id'),
            ['activity_id' => Activity::where('name', 'autoria')->first()->id]
        );

        $review->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->route('review.edit', $review->id);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Review $review)
    {
        $review->load('authors');

        $people = Person::query()
            ->orderBy('name')
            ->get();

        $categories = Category::all();

        return Inertia::render('admin/review/edit/index', [
            'review' => new ReviewResource($review),
            'people' => PersonResource::collection($people),

            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function update(Request $request, Review $review)
    {
        $dataForm = $request->all();

        $review->update($dataForm);

        $review->authors()->syncWithPivotValues(
            Arr::pluck($dataForm['authors'], 'id'),
            ['activity_id' => Activity::where('name', 'autoria')->first()->id]
        );

        $review->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT PEOPLE

    // public function editPeople(Review $review)
    // {
    //     $review->load('people');

    //     $activities = Activity::query()
    //         ->where('name', 'not like', 'autoria')
    //         ->get();

    //     $people = Person::query()
    //         ->get();

    //     return Inertia::render('admin/review/edit/people', [
    //         'review' => new ReviewResource($review),
    //         'activities' => ActivityResource::collection($activities),
    //         'people' => PersonResource::collection($people),
    //     ]);
    // }

    // public function updatePeople(Request $request, Review $review)
    // {
    //     $activities = $request->activities;

    //     if ($activities) {
    //         foreach ($activities as $activity) {
    //             if ($activity['people'] === null || count($activity['people']) < 1) {
    //                 $review->people()
    //                     ->wherePivot('activity_id', $activity['id'])
    //                     ->detach();
    //                 continue;
    //             }

    //             foreach ($activity['people'] as $person) {
    //                 if (in_array($person['id'], $review->people->pluck('id')->toArray())) {
    //                     if (
    //                         !in_array(
    //                             $activity['id'],
    //                             $review->people->where('id', $person['id'])
    //                                 ->pluck('pivot.activity_id')->toArray()
    //                         )
    //                     ) {
    //                         $review->people()->attach(
    //                             $person['id'],
    //                             ['activity_id' => $activity['id']]
    //                         );
    //                     }
    //                 } else {
    //                     $review->people()->attach(
    //                         $person['id'],
    //                         ['activity_id' => $activity['id']]
    //                     );
    //                 }
    //             }
    //         }

    //         $review->people()
    //             ->wherePivotNotIn('activity_id', collect($activities)->pluck('id'))
    //             ->detach();

    //         foreach ($review->people as $person) {
    //             if (
    //                 !in_array(
    //                     $person->id,
    //                     collect($activities)->pluck('people')
    //                         ->flatten(1)->pluck('id')->toArray()
    //                 )
    //             ) {
    //                 $review->people()->detach($person->id);
    //             }
    //         }
    //     }

    //     session()->flash('success', true);
    //     return redirect()->back();
    // }

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
                $this->storeFile(
                    $request,
                    $review->id,
                    Review::class,
                    $review->uuid,
                    'general'
                );
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
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
                $this->storeFile(
                    $request,
                    $review->id,
                    Review::class,
                    $review->uuid,
                    'content'
                );
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
    // DELETE

    public function destroy(Review $review)
    {
        $review->delete();

        session()->flash('success', true);
        return redirect()->back();
    }
}
