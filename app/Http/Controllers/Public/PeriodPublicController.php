<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeriodResource;
use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodPublicController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Period $period)
    {

        $period->load('historyArticles');

        return Inertia::render('period/show', [
            'period' => new PeriodResource($period)
        ]);
    }
}
