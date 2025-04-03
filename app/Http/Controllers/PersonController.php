<?php

namespace App\Http\Controllers;

use App\Http\Resources\PersonResource;
use App\Models\Person;
use Dotenv\Util\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $people = Person::query()
        ->with(
            'works',
        )
        ->get();

        // dd($people);

        // dd(PersonResource::collection($people)->first());

        return Inertia::render('Admin/Person/Index', [
            'people' => PersonResource::collection($people)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function storeSelect($name)
    {
        $person = Person::create(['name' => $name]);

        return response()->json(new PersonResource($person));
    }

    /**
     * Display the specified resource.
     */
    public function show(String $uuid)
    {
        $person = Person::where('uuid', $uuid)->first();

        return Inertia::render('Admin/Person/Show', [
            'person' => $person
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Person $person)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Person $person)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Person $person)
    {
        //
    }
}
