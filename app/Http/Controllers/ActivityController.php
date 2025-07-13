<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ActivityController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Activity::class);

        $activities = Activity::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/activities/index', [
            'activities' => ActivityResource::collection($activities),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Activity::class);

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
        Gate::authorize('update', Activity::class);

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
        Gate::authorize('delete', Activity::class);

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
        Gate::authorize('view', Activity::class);

        return Activity::fetchAsSelectOptions($request->q);
    }
}
