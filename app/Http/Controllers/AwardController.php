<?php

namespace App\Http\Controllers;

use App\Http\Resources\AwardResource;
use App\Models\Award;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;

class AwardController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        $awards = Award::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/awards/index', [
            'awards' => AwardResource::collection($awards),
        ]);
    }

    public function store(Request $request)
    {
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
        return Award::fetchAsSelectOption($request->q);
    }
}
