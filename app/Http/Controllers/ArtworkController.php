<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ArtworkResource;
use App\Http\Resources\PersonResource;
use App\Models\Activity;
use App\Models\Artwork;
use App\Models\Mention;
use App\Models\Person;
use App\Traits\HasFile;
use App\Traits\HasMention;
use Illuminate\Http\Resources\Json\JsonResource;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    use HasFile, HasMention;

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
        return Inertia::render('admin/artwork/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $artwork = Artwork::create($dataForm);

        $artwork->update($dataForm);

        $artwork->authors()->syncWithPivotValues(
            $request->authors_ids,
            ['is_author' => true]
        );
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

        $artwork->authors()->syncWithPivotValues(
            $request->authors_ids,
            ['is_author' => true]
        );
        $artwork->languages()->sync($request->languages_ids);
        $artwork->awards()->sync($request->awards_ids);
        $artwork->categories()->sync($request->categories_ids);
        $artwork->periods()->sync($request->periods_ids);

        session()->flash('success', true);
        return redirect()->back();
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

        if ($activitiesPeople) {
            $artwork->people()->detach();

            foreach ($activitiesPeople as $activityPerson) {
                $artwork->people()->attach(
                    $activityPerson['person_id'],
                    ['activity_id' => $activityPerson['activity_id']]
                );
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
    // EDIT MENTIONS

    public function editMentions(Artwork $artwork)
    {
        $artwork->load('mentioned');

        $mentionQueries = $this->getMentionQueries();

        return Inertia::render('admin/artwork/edit/mentions', [
            'artwork' => new ArtworkResource($artwork),
            'mention_queries' => new JsonResource($mentionQueries),
        ]);
    }

    public function updateMentions(Request $request, Artwork $artwork)
    {
        $artwork->mentioned()->delete();

        foreach ($request->mentions as $mention) {
            Mention::create([
                'mentioned_id' => $mention['mentioned_id'],
                'mentioned_type' => $mention['mentioned_type'],
                'mentioner_id' => $artwork->id,
                'mentioner_type' => $artwork::class
            ]);
        }

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
        $options = Artwork::fetchAsSelectOption($request->search);
        return response()->json($options);
    }
}
