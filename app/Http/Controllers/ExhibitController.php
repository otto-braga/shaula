<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExhibitEditRequest;
use App\Http\Requests\FetchRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ExhibitResource;
use App\Models\Activity;
use App\Models\Exhibit;
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

class ExhibitController extends Controller
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
        Gate::authorize('view', Exhibit::class);

        $exhibits = Exhibit::where(function ($query) {
                if (request()->has('q') && request()->q) {
                    $query->where('title', 'like', '%' . request()->q . '%');
                }
            })
            ->latest()
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/exhibit/index', [
            'exhibits' => ExhibitResource::collection($exhibits),
        ]);
    }

    public function show(Exhibit $exhibit)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        Gate::authorize('create', Exhibit::class);

        return Inertia::render('admin/exhibit/edit/index');
    }

    public function store(ExhibitEditRequest $request)
    {
        Gate::authorize('create', Exhibit::class);

        try {
            $request->validated();

            $exhibit = Exhibit::create(
                $request->only([
                    'title',
                ])
            );

            if ($request->has('date')) {
                $date = $request->date . '-01-01'; // Default to January 1st if only year is provided
                $exhibit->update(['date' => Carbon::parse($date, 'UTC')->startOfDay()]);
            }

            $this->syncUuids($request->authors_uuids, $exhibit->authors(), $this->syncAuthors(...));
            $this->syncUuids($request->awards_uuids, $exhibit->awards());
            $this->syncUuids($request->categories_uuids, $exhibit->categories());
            $this->syncUuids($request->periods_uuids, $exhibit->periods());

            session()->flash('success', true);
            return redirect()->route('exhibits.edit', $exhibit);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        $exhibit->load('authors');

        return Inertia::render('admin/exhibit/edit/index', [
            'exhibit' => new ExhibitResource($exhibit),
        ]);
    }

    public function update(ExhibitEditRequest $request, Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        try {
            $request->validated();

            $exhibit->update(
                $request->only([
                    'title',
                ])
            );

            if ($request->has('date')) {
                $date = $request->date . '-01-01'; // Default to January 1st if only year is provided
                $exhibit->update(['date' => Carbon::parse($date, 'UTC')->startOfDay()]);
            }

            $this->syncUuids($request->authors_uuids, $exhibit->authors(), $this->syncAuthors(...));
            $this->syncUuids($request->awards_uuids, $exhibit->awards());
            $this->syncUuids($request->categories_uuids, $exhibit->categories());
            $this->syncUuids($request->periods_uuids, $exhibit->periods());

            session()->flash('success', true);
            return redirect()->route('exhibits.edit', $exhibit);
        }
        catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT PEOPLE

    public function editPeople(Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        $exhibit->load('people');

        $activities = Activity::query()
            ->take(5)
            ->get();

        return Inertia::render('admin/exhibit/edit/people', [
            'exhibit' => new ExhibitResource($exhibit),
            'activities' => ActivityResource::collection($activities),
        ]);
    }

    public function updatePeople(ExhibitEditRequest $request, Exhibit $exhibit)
    {
        try {
            $request->validated();

            $this->handlePeopleUpdate($request, $exhibit);

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

    public function editImages(Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        return Inertia::render('admin/exhibit/edit/images', [
            'exhibit' => new ExhibitResource($exhibit),
        ]);
    }

    public function updateImages(ExhibitEditRequest $request, Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        try {
            $request->validated();

            $this->handleImageUpdate($request, $exhibit);

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

    public function editContent(Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        return Inertia::render('admin/exhibit/edit/content', [
            'exhibit' => new ExhibitResource($exhibit),
        ]);
    }

    public function updateContent(ExhibitEditRequest $request, Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        try {
            $request->validated();

            $this->handleContentUpdate($request, $exhibit);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT SOURCES

    public function editSources(Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        $exhibit->load('sources');

        return Inertia::render('admin/exhibit/edit/sources', [
            'exhibit' => new ExhibitResource($exhibit),
        ]);
    }

    public function updateSources(ExhibitEditRequest $request, Exhibit $exhibit)
    {
        Gate::authorize('update', Exhibit::class);

        try {
            $request->validated();

            $this->syncUuids($request->sources_uuids, $exhibit->sources());

            $exhibit->save();

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

    public function destroy(Exhibit $exhibit)
    {
        Gate::authorize('delete', Exhibit::class);

        try {
            $exhibit->delete();

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
        Gate::authorize('view', Exhibit::class);

        $request->validated();

        return (new SearchController())->fetchMulti(
            $request->merge([
                'limit' => 5,
                'only' => ['exhibits'],
            ])
        );
    }
}
