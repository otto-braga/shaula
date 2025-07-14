<?php

namespace App\Http\Controllers;

use App\Http\Resources\LanguageResource;
use App\Models\Language;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LanguageController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Language::class);

        $languages = Language::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/languages/index', [
            'languages' => LanguageResource::collection($languages),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Language::class);

        $request->validate([
            'name' => 'required|unique:languages',
        ]);

        try {
            Language::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Linguagem criada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar linguagem.');
        }
    }

    public function update(Language $language)
    {
        Gate::authorize('update', Language::class);

        request()->validate([
            'name' => 'required|unique:languages',
        ]);

        try {
            $language->update([
                'name' => request('name'),
            ]);
            return redirect()->back()->with('success', 'Linguagem atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar linguagem.');
        }
    }

    public function destroy(Language $language)
    {
        Gate::authorize('delete', Language::class);

        try {
            $language->delete();
            return redirect()->back()->with('success', 'Linguagem deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar gender.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', Language::class);

        return Language::fetchAsSelectOptions($request->q);
    }
}
