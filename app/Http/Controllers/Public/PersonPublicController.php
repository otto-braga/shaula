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
        $people = Person::paginate(12);

        return Inertia::render('Person/Index', [
            'people' => PersonResource::collection($people)
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $person = Person::where('slug', $slug)->firstOrFail();

        return Inertia::render('Person/Show', [
            'person' => new PersonResource($person)
        ]);
    }

}
