<?php

namespace App\Http\Controllers;

use App\Http\Resources\SourceCategoryResource;
use App\Models\SourceCategory;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SourceCategoryController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', SourceCategory::class);

        $souceCategories = SourceCategory::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return inertia('admin/sourceCategories/index', [
            'sourceCategories' => SourceCategoryResource::collection($souceCategories),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', SourceCategory::class);

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
        Gate::authorize('update', SourceCategory::class);

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
        Gate::authorize('delete', SourceCategory::class);

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
        Gate::authorize('view', SourceCategory::class);

        return SourceCategory::fetchSelectOptions($request->q);
    }
}
