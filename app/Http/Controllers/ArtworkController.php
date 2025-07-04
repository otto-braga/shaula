<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ArtworkResource;
use App\Models\Activity;
use App\Models\Artwork;
use App\Traits\HandlesFiles;
use App\Traits\SyncsAuthors;
use App\Traits\ParsesUuids;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use App\Traits\UpdatesPeople;
use Carbon\Carbon;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        SyncsAuthors,
        UpdatesPeople,
        UpdatesImages,
        UpdatesContent;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $artworks = Artwork::query()
            ->latest()
            ->paginate(2);

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
        $dataForm = $request->except(['date']);

        if ($request->has('date')) {
            $date = $request->date . '-01-01'; // Default to January 1st if only year is provided
            $dataForm['date'] = Carbon::parse($date, 'UTC')->startOfDay();
        }

        $artwork = Artwork::create($dataForm);

        $this->syncUuids($request->authors_uuids, $artwork->authors(), $this->syncAuthors(...));
        $this->syncUuids($request->languages_uuids, $artwork->languages());
        $this->syncUuids($request->awards_uuids, $artwork->awards());
        $this->syncUuids($request->categories_uuids, $artwork->categories());
        $this->syncUuids($request->periods_uuids, $artwork->periods());

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

        if ($request->has('date')) {
            $dataForm['date'] = $request->date . '-01-01'; // Default to June 1st if only year is provided
        }

        $artwork->update($dataForm);

        $this->syncUuids($request->authors_uuids, $artwork->authors(), $this->syncAuthors(...));
        $this->syncUuids($request->languages_uuids, $artwork->languages());
        $this->syncUuids($request->awards_uuids, $artwork->awards());
        $this->syncUuids($request->categories_uuids, $artwork->categories());
        $this->syncUuids($request->periods_uuids, $artwork->periods());

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
        $this->handlePeopleUpdate($request, $artwork);

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
            $this->handleImageUpdate($request, $artwork);

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
            $this->handleContentUpdate($request, $artwork);

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
        $this->syncUuids($request->sources_uuids, $artwork->sources());

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
