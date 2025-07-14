<?php

namespace App\Http\Controllers;

use App\Http\Resources\AwardResource;
use App\Models\Award;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AwardController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Award::class);

        $awards = Award::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/awards/index', [
            'awards' => AwardResource::collection($awards),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Award::class);

        $request->validate([
            'name' => 'required|unique:awards',
            'promoter' => 'optional|string|max:255',
        ]);

        try {
            Award::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Prêmio criado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar prêmio.');
        }
    }

    public function update(Request $request, Award $award)
    {
        Gate::authorize('update', Award::class);

        $request->validate([
            'name' => 'required|unique:awards,name,' . $award->id,
            'promoter' => 'optional|string|max:255',
        ]);

        try {
            $award->update([
                'name' => $request->name,
                'promoter' => $request->promoter,
            ]);
            return redirect()->back()->with('success', 'Prêmio atualizado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar prêmio.');
        }
    }

    public function destroy(Award $award)
    {
        Gate::authorize('delete', Award::class);

        try {
            $award->delete();
            return redirect()->back()->with('success', 'Prêmio deletado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar prêmio.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', Award::class);

        return Award::fetchAsSelectOptions($request->q);
    }
}
