<?php

namespace App\Http\Controllers;

use App\Http\Resources\GenderResource;
use App\Models\Gender;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class GenderController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Gender::class);

        $genders = Gender::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/genders/index', [
            'genders' => GenderResource::collection($genders),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Gender::class);

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
        Gate::authorize('update', Gender::class);

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
        Gate::authorize('delete', Gender::class);

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
        Gate::authorize('view', Gender::class);

        return Gender::fetchAsSelectOptions($request->q);
    }
}
