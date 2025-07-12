<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        Gate::authorize('view', Category::class);

        $categories = Category::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/categories/index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Category::class);

        $request->validate([
            'name' => 'required|unique:categories',
        ]);

        try {
            Category::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Categoria criada com sucesso.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Erro ao criar categoria.');
        }
    }

    public function update(Category $category)
    {
        Gate::authorize('update', Category::class);

        request()->validate([
            'name' => 'required|unique:categories',
        ]);

        try {
            $category->update([
                'name' => request('name'),
            ]);
            return redirect()->back()->with('success', 'Categoria atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar categoria.');
        }
    }

    public function destroy(Category $category)
    {
        Gate::authorize('delete', Category::class);

        try {
            $category->delete();
            return redirect()->back()->with('success', 'Categoria deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar categoria.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        Gate::authorize('view', Category::class);

        return Category::fetchAsSelectOption($request->q);
    }
}
