<?php

namespace App\Http\Controllers;

use App\Http\Resources\GenderResource;
use App\Models\Gender;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GenderController extends Controller
{
    public function index()
    {
        $genders = Gender::all();

        return Inertia::render('admin/genders/index', [
            'genders' => GenderResource::collection($genders),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:genders',
        ]);

        try {
            Gender::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Identidade de gênero criada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar identidade de gênero.');
        }
    }

    public function update(Gender $gender)
    {
        request()->validate([
            'name' => 'required|unique:genders',
        ]);

        try {
            $gender->update([
                'name' => request('name'),
            ]);
            return redirect()->back()->with('success', 'Identidade de gênero atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar identidade de gênero.');
        }
    }

    public function destroy(Gender $gender)
    {
        try {
            $gender->delete();
            return redirect()->back()->with('success', 'Identidade de gênero deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar identidade de gênero.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return Gender::fetchAsSelectOptions($request->q);
    }
}
