<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArtworkResource;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PersonResource;
use App\Models\Artwork;
use App\Models\Review;
use App\Models\Category;
use App\Models\Mention;
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
            Arr::pluck($request->authors, 'id'),
            ['is_author' => true]
        );
        $review->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->route('review.edit', $review->slug);
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
            Arr::pluck($request->authors, 'id'),
            ['is_author' => true]
        );
        $review->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->back();
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
    // DELETE

    public function destroy(Review $review)
    {
        $review->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // MENTIONS

    public function editMentions(Review $review)
    {
        $review->load('mentioned');

        $people = Person::query()
            ->get();

        $artworks = Artwork::query()
            ->get();

        return Inertia::render('admin/review/edit/mentions', [
            'review' => new ReviewResource($review),
            'people' => PersonResource::collection($people),
            'artworks' => ArtworkResource::collection($artworks),
        ]);
    }

    public function updateMentions(Request $request, Review $review)
    {
        $review->mentioned()->where('mentioned_type', Person::class)
            ->whereNotIn('mentioned_id', Arr::pluck($request->people, 'id'))
            ->delete();

        if ($request->has('people') && count($request->people) > 0) {
            foreach($request->people as $person) {
                Mention::updateOrCreate([
                    'mentioned_id' => $person['id'],
                    'mentioned_type' => Person::class,
                    'mentioner_id' => $review->id,
                    'mentioner_type' => Review::class
                    ]);
            }
        }

        $review->mentioned()->where('mentioned_type', Artwork::class)
            ->whereNotIn('mentioned_id', Arr::pluck($request->artworks, 'id'))
            ->delete();

        if ($request->has('artworks') && count($request->artworks) > 0) {
            foreach($request->artworks as $artwork) {
                Mention::updateOrCreate([
                    'mentioned_id' => $artwork['id'],
                    'mentioned_type' => Artwork::class,
                    'mentioner_id' => $review->id,
                    'mentioner_type' => Review::class
                    ]);
            }
        }

        session()->flash('success', true);
        return redirect()->back();
    }
}
