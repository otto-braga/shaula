<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::all();

        return Inertia::render('admin/activities/index', [
            'activities' => ActivityResource::collection($activities),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:activities',
        ]);

        try {
            Activity::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Atividade criada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar atividade.');
        }
    }

    public function update(Activity $activity)
    {
        request()->validate([
            'name' => 'required|unique:activities',
        ]);

        try {
            $activity->update([
                'name' => request('name'),
            ]);
            return redirect()->back()->with('success', 'Atividade atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar atividade.');
        }
    }

    public function destroy(Activity $activity)
    {
        try {
            $activity->delete();
            return redirect()->back()->with('success', 'Atividade deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar atividade.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return Activity::fetchAsSelectOption($request->q);
    }
}
