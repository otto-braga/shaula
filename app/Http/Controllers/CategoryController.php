<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\HasCommonPaginationConstants;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use
        HasCommonPaginationConstants;

    public function index()
    {
        $categories = Category::query()
            ->orderBy('name')
            ->paginate(self::COMMON_INDEX_PAGINATION_SIZE);

        return Inertia::render('admin/categories/index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function store(Request $request)
    {
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
        return Category::fetchAsSelectOption($request->q);
    }
}
