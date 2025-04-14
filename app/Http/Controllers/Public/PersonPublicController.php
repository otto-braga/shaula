<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use Inertia\Inertia;

class PersonPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $people = Person::latest()->paginate(12);

        return Inertia::render('person/index', [
            'people' => PersonResource::collection($people)
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $person = Person::where('id', $id)->firstOrFail();

        return Inertia::render('person/show', [
            'person' => new PersonResource($person)
        ]);
    }
}
