<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Person::query();

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        $people = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('person/index', [
            'people' => PersonResource::collection($people),
            'filters' => $request->only('search'),
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $person = Person::where('id', $id)
            ->firstOrFail();

        $person->load([
            'artworks',
        ]);

        return Inertia::render('person/show', [
            'person' => new PersonResource($person)
        ]);
    }
}
