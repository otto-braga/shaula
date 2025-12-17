<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExhibitResource;
use App\Models\Exhibit;
use Inertia\Inertia;

class ExhibitPublicController extends Controller
{
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
