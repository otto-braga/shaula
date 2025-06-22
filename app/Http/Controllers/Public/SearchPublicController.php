<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchPublicController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('search', [
            'q' => $request->q ?? null,
        ]);
    }
}
