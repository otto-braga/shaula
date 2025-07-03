<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class PersonPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $people = Person::latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('person/index', [
            'people' => PersonResource::collection($people),
            'filters' => Request::all('search'),
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $person = Person::where('slug', $slug)
            ->firstOrFail();

        $person->load([
            'artworks',
            'reviews'
        ]);

        return Inertia::render('person/show', [
            'person' => new PersonResource($person)
        ]);
    }
}
