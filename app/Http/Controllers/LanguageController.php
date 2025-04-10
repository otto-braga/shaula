<?php

namespace App\Http\Controllers;

use App\Http\Resources\LanguageResource;
use App\Models\Language;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LanguageController extends Controller
{
    public function index()
    {
        $languages = Language::all();

        return Inertia::render('admin/languages/index', [
            'languages' => LanguageResource::collection($languages),
        ]);
    }

    public function store(Request $request)
    {
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
        try {
            $language->delete();
            return redirect()->back()->with('success', 'Linguagem deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar gender.');
        }
    }
}
