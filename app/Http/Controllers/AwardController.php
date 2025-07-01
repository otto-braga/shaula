<?php

namespace App\Http\Controllers;

use App\Models\Award;
use Illuminate\Http\Request;

class AwardController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Award $award)
    {
        //
    }

    public function edit(Award $award)
    {
        //
    }

    public function update(Request $request, Award $award)
    {
        //
    }

    public function destroy(Award $award)
    {
        //
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return Award::fetchAsSelectOption($request->q);
    }
}
