<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use App\Traits\HandlesFiles;
use App\Traits\ParsesUuids;
use App\Traits\UpdatesContent;
use App\Traits\UpdatesImages;
use Inertia\Inertia;

class PersonController extends Controller
{
    use
        HandlesFiles,
        ParsesUuids,
        UpdatesImages,
        UpdatesContent;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $people = Person::query()
            ->latest()
            ->get();

        return Inertia::render('admin/person/index', [
            'people' => PersonResource::collection($people),
        ]);
    }

    public function show(Person $person)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        return Inertia::render('admin/person/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $person = Person::create($dataForm);

        $this->syncUuids($request->genders_uuids, $person->genders());
        $this->syncUuids($request->cities_uuids, $person->cities());
        $this->syncUuids($request->periods_uuids, $person->periods());

        session()->flash('success', true);
        return redirect()->route('people.edit', $person);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Person $person)
    {
        $person->load([
            'artworks',
            'reviews',
        ]);

        return Inertia::render('admin/person/edit/index', [
            'person' => new PersonResource($person),
        ]);
    }

    public function update(Request $request, Person $person)
    {
        $dataForm = $request->all();

        $person->update($dataForm);

        $this->syncUuids($request->genders_uuids, $person->genders());
        $this->syncUuids($request->cities_uuids, $person->cities());
        $this->syncUuids($request->periods_uuids, $person->periods());

        session()->flash('success', true);
        return redirect()->route('people.edit', $person);
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Person $person)
    {
        return Inertia::render('admin/person/edit/images', [
            'person' => new PersonResource($person),
        ]);
    }

    public function updateImages(Request $request, Person $person)
    {
        try {
            $this->handleImageUpdate($request, $person);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CHRONOLOGY

    public function editChronology(Person $person)
    {
        return Inertia::render('admin/person/edit/chronology', [
            'person' => new PersonResource($person),
        ]);
    }

    public function updateChronology(Request $request, Person $person)
    {
        try {
            $this->handleContentUpdate($request, $person);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CONTENT

    public function editContent(Person $person)
    {
        return Inertia::render('admin/person/edit/content', [
            'person' => new PersonResource($person),
        ]);
    }

    public function updateContent(Request $request, Person $person)
    {
        try {
            $this->handleContentUpdate($request, $person);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT SOURCES

    public function editSources(Person $person)
    {
        $person->load('sources');

        return Inertia::render('admin/person/edit/sources', [
            'person' => new PersonResource($person),
        ]);
    }

    public function updateSources(Request $request, Person $person)
    {
        $this->syncUuids($request->sources_uuids, $person->sources());

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Person $person)
    {
        $person->delete();

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
                'only' => ['people'],
            ])
        );
    }
}
