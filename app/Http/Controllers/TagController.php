<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::all();

        return Inertia::render('admin/tags/index', [
            'tags' => TagResource::collection($tags),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:tags',
        ]);

        try {
            Tag::create([
                'name' => $request->name,
            ]);
            return redirect()->back()->with('success', 'Tag criada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao criar tag.');
        }
    }

    public function update(Tag $tag)
    {
        request()->validate([
            'name' => 'required|unique:tags',
        ]);

        try {
            $tag->update([
                'name' => request('name'),
            ]);
            return redirect()->back()->with('success', 'Tag atualizada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar tag.');
        }
    }

    public function destroy(Tag $tag)
    {
        try {
            $tag->delete();
            return redirect()->back()->with('success', 'Tag deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar tag.');
        }
    }
}
