<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArtworkEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ArtworkResource;
use App\Models\Activity;
use App\Models\Artwork;
use App\Traits\HandlesFiles;
use App\Traits\HasCommonPaginationConstants;
use App\Traits\SyncsAuthors;
use App\Traits\ParsesUuids;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use App\Traits\UpdatesPeople;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        SyncsAuthors,
        UpdatesPeople,
        UpdatesImages,
        UpdatesContent,
        HasCommonPaginationConstants;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        Gate::authorize('view', Artwork::class);

        $artworks = Artwork::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('title', 'like', '%' . request()->q . '%');
                }
            })
            ->latest()
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

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
        Gate::authorize('create', Artwork::class);

        return Inertia::render('admin/artwork/edit/index');
    }

    public function store(ArtworkEditRequest $request)
    {
        Gate::authorize('create', Artwork::class);

        try {
            $request->validated();

            $artwork = Artwork::create(
                $request->only([
                    'title',
                    'dimensions',
                    'materials',
                ])
            );

            if ($request->has('date')) {
                $date = $request->date . '-01-01'; // Default to January 1st if only year is provided
                $artwork->update(['date' => Carbon::parse($date, 'UTC')->startOfDay()]);
            }

            $this->syncUuids($request->authors_uuids, $artwork->authors(), $this->syncAuthors(...));
            $this->syncUuids($request->languages_uuids, $artwork->languages());
            $this->syncUuids($request->awards_uuids, $artwork->awards());
            $this->syncUuids($request->categories_uuids, $artwork->categories());
            $this->syncUuids($request->periods_uuids, $artwork->periods());

            session()->flash('success', true);
            return redirect()->route('artworks.edit', $artwork);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        $artwork->load('authors');

        return Inertia::render('admin/artwork/edit/index', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function update(ArtworkEditRequest $request, Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        try {
            $request->validated();

            $artwork->update(
                $request->only([
                    'title',
                    'dimensions',
                    'materials',
                ])
            );

            if ($request->has('date')) {
                $date = $request->date . '-01-01'; // Default to January 1st if only year is provided
                $artwork->update(['date' => Carbon::parse($date, 'UTC')->startOfDay()]);
            }

            $this->syncUuids($request->authors_uuids, $artwork->authors(), $this->syncAuthors(...));
            $this->syncUuids($request->languages_uuids, $artwork->languages());
            $this->syncUuids($request->awards_uuids, $artwork->awards());
            $this->syncUuids($request->categories_uuids, $artwork->categories());
            $this->syncUuids($request->periods_uuids, $artwork->periods());

            session()->flash('success', true);
            return redirect()->route('artworks.edit', $artwork);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT PEOPLE

    public function editPeople(Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        $artwork->load('people');

        $activities = Activity::query()
            ->take(5)
            ->get();

        return Inertia::render('admin/artwork/edit/people', [
            'artwork' => new ArtworkResource($artwork),
            'activities' => ActivityResource::collection($activities),
        ]);
    }

    public function updatePeople(ArtworkEditRequest $request, Artwork $artwork)
    {
        try {
            $request->validated();

            $this->handlePeopleUpdate($request, $artwork);

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        return Inertia::render('admin/artwork/edit/images', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function updateImages(ArtworkEditRequest $request, Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        try {
            $request->validated();

            $this->handleImageUpdate($request, $artwork);

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CONTENT

    public function editContent(Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        return Inertia::render('admin/artwork/edit/content', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function updateContent(ArtworkEditRequest $request, Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        try {
            $request->validated();

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
        Gate::authorize('update', Artwork::class);

        $artwork->load('sources');

        return Inertia::render('admin/artwork/edit/sources', [
            'artwork' => new ArtworkResource($artwork),
        ]);
    }

    public function updateSources(ArtworkEditRequest $request, Artwork $artwork)
    {
        Gate::authorize('update', Artwork::class);

        try {
            $request->validated();

            $this->syncUuids($request->sources_uuids, $artwork->sources());

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Artwork $artwork)
    {
        Gate::authorize('delete', Artwork::class);

        try {
            $artwork->delete();

            session()->flash('success', true);
            return redirect()->back();
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(FetchRequest $request)
    {
        Gate::authorize('view', Artwork::class);

        $request->validated();

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['artworks'],
            ])
        );
    }
}
