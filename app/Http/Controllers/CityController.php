<?php

namespace App\Http\Controllers;

use App\Http\Resources\CityResource;
use App\Models\City;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        $cities = City::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

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
        return City::fetchAsSelectOption($request->q);
    }
}
