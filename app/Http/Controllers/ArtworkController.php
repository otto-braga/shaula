<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ArtworkResource;
use App\Http\Resources\AwardResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\LanguageResource;
use App\Http\Resources\PersonResource;
use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Award;
use App\Models\Category;
use App\Models\Language;
use App\Models\Person;
use App\Traits\HasFile;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    use HasFile;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $artworks = Artwork::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/artwork/index', [
            'artworks' => ArtworkResource::collection($artworks),
        ]);
    }

    public function show(Artwork $artwork)
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

        $languages = Language::all();
        $awards = Award::all();
        $categories = Category::all();

        return Inertia::render('admin/artwork/edit/index', [
            'people' => PersonResource::collection($people),
            'languages' => LanguageResource::collection($languages),
            'awards' => AwardResource::collection($awards),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $artwork = Artwork::create($dataForm);

        $artwork->authors()->syncWithPivotValues(
            Arr::pluck($request->authors, 'id'),
            ['is_author' => true]
        );
        $artwork->languages()->sync(Arr::pluck($request->languages, 'id'));
        $artwork->awards()->sync(Arr::pluck($request->awards, 'id'));
        $artwork->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->route('artwork.edit', $artwork->id);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Artwork $artwork)
    {
        $artwork->load('authors');

        $people = Person::query()
            ->orderBy('name')
            ->get();

        $languages = Language::all();
        $awards = Award::all();
        $categories = Category::all();

        return Inertia::render('admin/artwork/edit/index', [
            'artwork' => new ArtworkResource($artwork),
            'people' => PersonResource::collection($people),

            'languages' => LanguageResource::collection($languages),
            'awards' => AwardResource::collection($awards),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function update(Request $request, Artwork $artwork)
    {
        $dataForm = $request->all();

        $artwork->update($dataForm);

        $artwork->authors()->syncWithPivotValues(
            Arr::pluck($request->authors, 'id'),
            ['is_author' => true]
        );
        $artwork->languages()->sync(Arr::pluck($request->languages, 'id'));
        $artwork->awards()->sync(Arr::pluck($request->awards, 'id'));
        $artwork->categories()->sync(Arr::pluck($request->categories, 'id'));

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT PEOPLE

    public function editPeople(Artwork $artwork)
    {
        $artwork->load('people');

        $activities = Activity::query()
            ->where('id', '!=', 1)
            ->get();

        $people = Person::query()
            ->get();

        return Inertia::render('admin/artwork/edit/people', [
            'artwork' => new ArtworkResource($artwork),
            'activities' => ActivityResource::collection($activities),
            'people' => PersonResource::collection($people),
        ]);
    }

    public function updatePeople(Request $request, Artwork $artwork)
    {
        $activities = $request->activities;

        if ($activities) {
            foreach ($activities as $activity) {
                if ($activity['people'] === null || count($activity['people']) < 1) {
                    $artwork->people()
                        ->wherePivot('activity_id', $activity['id'])
                        ->detach();
                    continue;
                }

                foreach ($activity['people'] as $person) {
                    if (in_array($person['id'], $artwork->people->pluck('id')->toArray())) {
                        if (
                            !in_array(
                                $activity['id'],
                                $artwork->people->where('id', $person['id'])
                                    ->pluck('pivot.activity_id')->toArray()
                            )
                        ) {
                            $artwork->people()->attach(
                                $person['id'],
                                ['activity_id' => $activity['id']]
                            );
                        }
                    } else {
                        $artwork->people()->attach(
                            $person['id'],
                            ['activity_id' => $activity['id']]
                        );
                    }
                }
            }

            $artwork->people()
                ->wherePivotNotIn('activity_id', collect($activities)->pluck('id'))
                ->detach();

            foreach ($artwork->people as $person) {
                if (
                    !in_array(
                        $person->id,
                        collect($activities)->pluck('people')
                            ->flatten(1)->pluck('id')->toArray()
                    )
                ) {
                    $artwork->people()->detach($person->id);
                }
            }
        }

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Artwork $artwork)
    {
        return Inertia::render('admin/artwork/edit/images', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function updateImages(Request $request, Artwork $artwork)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile(
                    $request,
                    $artwork->id,
                    Artwork::class,
                    $artwork->uuid,
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

    public function editContent(Artwork $artwork)
    {
        return Inertia::render('admin/artwork/edit/content', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function updateContent(Request $request, Artwork $artwork)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile(
                    $request,
                    $artwork->id,
                    Artwork::class,
                    $artwork->uuid,
                    'content'
                );
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $artwork->update(['content' => $request->content]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Artwork $artwork)
    {
        $artwork->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

}
