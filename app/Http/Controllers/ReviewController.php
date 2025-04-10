<?php

namespace App\Http\Controllers;

use App\Http\Resources\PersonResource;
use App\Http\Resources\WorkResource;
use App\Models\Person;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with('work')->get();

        return Inertia::render('admin/reviews/index', [
            'reviews' => WorkResource::collection($reviews)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $people = Person::all();

        return Inertia::render('admin/work/edit/index', [
            'workable_types' => new JsonResource([['value' => 'App\Models\Review', 'label' => 'Crítica']]),
            'people' => PersonResource::collection($people),
            'default_workable_type' => 'App\Models\Review',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
