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
    public function index(\Illuminate\Http\Request $request)
    {
        $query = Person::query();

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('letter') && $request->letter) {
            // Using LIKE allows case-insensitive and accent-insensitive matching 
            // if the database collation supports it (which Laravel defaults to).
            $query->where('name', 'like', $request->letter . '%');
        }

        $orderBy = $request->get('orderBy', 'name');
        $direction = $request->get('direction', 'asc');

        // Ordering alphabetically, utilizing DB collation for case/accent insensitivity
        $people = $query->orderBy($orderBy, $direction)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('person/index', [
            'people' => PersonResource::collection($people),
            'filters' => $request->only(['search', 'letter', 'orderBy', 'direction']),
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
            'reviews',
            'exhibits'
        ]);

        return Inertia::render('person/show', [
            'person' => new PersonResource($person)
        ]);
    }
}
