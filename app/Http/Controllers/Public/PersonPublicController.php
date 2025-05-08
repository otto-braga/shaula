<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class PersonPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // Faz a busca paginada e separa os resultados
        // do paginação. Isso é feito para que 
        // o scroll infinito funcione. No momomento desta
        // implementação Inertia::merge(para dar merge na pagination
        // e resultados da query) não está funcionando.
        // Para tutorial: https://laracasts.com/series/inertia-2-unleashed/episodes/5?autoplay=true

        $people = Person::latest()
            ->filter(Request::only('search'))
            ->with('cities')
            ->paginate(4)
            ->withQueryString();

        return Inertia::render('person/index', [
            'people' => Inertia::merge($people->items()),
            'pagination' => Arr::except($people->toArray(), 'data'),
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
