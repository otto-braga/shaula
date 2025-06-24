<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ArtworkResource;
use App\Models\Activity;
use App\Models\Artwork;
use App\Traits\HasFile;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    use HasFile;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $artworks = Artwork::query()
            ->latest()
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
        return Inertia::render('admin/artwork/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $artwork = Artwork::create($dataForm);

        $artwork->authors()->sync($request->authors_ids);
        $artwork->languages()->sync($request->languages_ids);
        $artwork->awards()->sync($request->awards_ids);
        $artwork->categories()->sync($request->categories_ids);
        $artwork->periods()->sync($request->periods_ids);

        session()->flash('success', true);
        return redirect()->route('artworks.edit', $artwork);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Artwork $artwork)
    {
        $artwork->load('authors');

        return Inertia::render('admin/artwork/edit/index', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function update(Request $request, Artwork $artwork)
    {
        $dataForm = $request->all();

        $artwork->update($dataForm);

        $artwork->authors()->sync($request->authors_ids);
        $artwork->languages()->sync($request->languages_ids);
        $artwork->awards()->sync($request->awards_ids);
        $artwork->categories()->sync($request->categories_ids);
        $artwork->periods()->sync($request->periods_ids);

        session()->flash('success', true);
        return redirect()->route('artworks.edit', $artwork);
    }

    // -------------------------------------------------------------------------
    // EDIT PEOPLE

    public function editPeople(Artwork $artwork)
    {
        $artwork->load('people');

        $activities = Activity::query()
            ->take(5)
            ->get();

        return Inertia::render('admin/artwork/edit/people', [
            'artwork' => new ArtworkResource($artwork),
            'activities' => ActivityResource::collection($activities),
        ]);
    }

    public function updatePeople(Request $request, Artwork $artwork)
    {
        $activitiesPeople = $request->activitiesPeople;

        if ($activitiesPeople && count($activitiesPeople) > 0) {
            foreach ($activitiesPeople as $activityPerson) {
                foreach ($artwork->people as $person) {
                    if (
                        $person->id == $activityPerson['person_id']
                        && $person->pivot->activity_id == $activityPerson['activity_id']
                    ) {
                        continue;
                    }

                    $artwork->people()->detach($person->id, ['activity_id' => $person->pivot->activity_id]);
                }
            }

            foreach ($activitiesPeople as $activityPerson) {
                if (
                    !$artwork->people()
                    ->where('person_id', $activityPerson['person_id'])
                    ->where('activity_id', $activityPerson['activity_id'])
                    ->first()
                ) {
                    $artwork->people()->attach(
                        $activityPerson['person_id'],
                        ['activity_id' => $activityPerson['activity_id']]
                    );
                }
            }

            session()->flash('success', true);
            return redirect()->back();
        }
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
                $this->storeFile($request, $artwork, 'general');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            if ($artwork->images()->count() > 0) {
                $artwork->images()->update(['is_primary' => false]);
                if ($request->primaryImageId > 0) {
                    $artwork->images()->where('id', $request->primaryImageId)->update(['is_primary' => true]);
                } else {
                    $artwork->images()->first()->update(['is_primary' => true]);
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
                $this->storeFile($request, $artwork, 'content');
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
    // EDIT SOURCES

    public function editSources(Artwork $artwork)
    {
        $artwork->load('sources');

        return Inertia::render('admin/artwork/edit/sources', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function updateSources(Request $request, Artwork $artwork)
    {
        $artwork->sources()->sync($request->sources_ids);

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Artwork $artwork)
    {
        $artwork->delete();

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
                'only' => ['artworks'],
            ])
        );
    }
}
