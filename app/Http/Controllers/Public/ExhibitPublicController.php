<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExhibitResource;
use App\Models\Exhibit;
use Inertia\Inertia;

class ExhibitPublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exhibits = Exhibit::orderBy('date', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('exhibit/index', [
            'exhibits' => ExhibitResource::collection($exhibits),
            'filters' => \Illuminate\Support\Facades\Request::all('search'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $exhibit = Exhibit::where('slug', $slug)->firstOrFail();

        return Inertia::render('exhibit/show', [
            'exhibit' => new ExhibitResource($exhibit)
        ]);
    }
}
