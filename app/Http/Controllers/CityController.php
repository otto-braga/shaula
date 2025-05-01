<?php

namespace App\Http\Controllers;

use App\Http\Resources\CityResource;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::all();

        return Inertia::render('admin/cities/index', [
            'cities' => CityResource::collection($cities),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:cities',
        ]);

        try {
            City::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Cidade criada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar cidade.');
        }
    }

    public function update(City $city)
    {
        request()->validate([
            'name' => 'required|unique:cities',
        ]);

        try {
            $city->update([
                'name' => request('name'),
            ]);
            return redirect()->back()->with('success', 'Cidade atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar cidade.');
        }
    }

    public function destroy(City $city)
    {
        try {
            $city->delete();
            return redirect()->back()->with('success', 'Cidade deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar cidade.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        $options = City::fetchAsSelectOption($request->search);
        return response()->json($options);
    }
}
