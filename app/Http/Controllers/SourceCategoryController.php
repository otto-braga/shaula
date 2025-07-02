<?php

namespace App\Http\Controllers;

use App\Http\Resources\SourceCategoryResource;
use App\Models\SourceCategory;
use Illuminate\Http\Request;

class SourceCategoryController extends Controller
{
    public function index()
    {
        $souceCategories = SourceCategory::all();

        return inertia('admin/sourceCategories/index', [
            'sourceCategories' => SourceCategoryResource::collection($souceCategories),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:source_categories',
        ]);

        try {
            SourceCategory::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Categoria de fonte criada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar categoria de fonte.');
        }
    }

    public function update(Request $request, SourceCategory $sourceCategory)
    {
        $request->validate([
            'name' => 'required|unique:source_categories',
        ]);

        try {
            $sourceCategory->update([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Categoria de fonte atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar categoria de fonte.');
        }

    }

    public function destroy(SourceCategory $sourceCategory)
    {
        try {
            $sourceCategory->delete();
            return redirect()->back()->with('success', 'Categoria de fonte deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar categoria de fonte.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        return SourceCategory::fetchSelectOptions($request->q);
    }
}
