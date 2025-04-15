<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeriodResource;
use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodController extends Controller
{
    public function index()
    {
        $periods = Period::all();

        return Inertia::render('admin/period/index', [
            'periods' => PeriodResource::collection($periods),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:periods',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'about' => 'required',
        ]);

        try {
            Period::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'about' => $request->about,
            ]);
            return redirect()->back()->with('success', 'Período criada com sucesso.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Erro ao criar período.');
        }
    }

    public function update(Period $category)
    {
        request()->validate([
            'name' => 'required|unique:periods',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'about' => 'required',
        ]);

        try {
            $category->update([
                'name' => request('name'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'about' => request('about'),
            ]);
            return redirect()->back()->with('success', 'Período atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar período.');
        }
    }

    public function destroy(Period $category)
    {
        try {
            $category->delete();
            return redirect()->back()->with('success', 'Período deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar período.');
        }
    }
}
