<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeriodResource;
use App\Models\Period;
use App\Traits\HasFile;
use App\Traits\HasMention;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodController extends Controller
{
    use HasFile, HasMention;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $periods = Period::query()
            ->latest()
            ->get();

        return Inertia::render('admin/period/index', [
            'periods' => PeriodResource::collection($periods)
        ]);
    }

    public function show(Period $period)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        return Inertia::render('admin/period/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $period = Period::create($dataForm);

        // já permite relacionar com os artigos ?
        // $period->historyArticles()->sync($request->historyArticles_ids);

        session()->flash('success', true);
        return redirect()->route('periods.edit', $period->slug);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Period $period)
    {
        // $period->load('historyArticles');

        return Inertia::render('admin/period/edit/index', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function update(Request $request, Period $period)
    {
        $dataForm = $request->all();

        $period->update($dataForm);

        $period->historyArticles()->sync($request->historyArticles_ids);

        session()->flash('success', true);

        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Period $period)
    {
        return Inertia::render('admin/period/edit/images', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateImages(Request $request, Period $period)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $period, 'general');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            if ($period->images()->count() > 0) {
                $period->images()->update(['is_primary' => false]);
                if ($request->primaryImageId > 0) {
                    $period->images()->where('id', $request->primaryImageId)->update(['is_primary' => true]);
                } else {
                    $period->images()->first()->update(['is_primary' => true]);
                }
            }

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT CONTENT

    public function editContent(Period $period)
    {
        return Inertia::render('admin/period/edit/content', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function updateContent(Request $request, Period $period)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $period, 'content');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $period->update(['content' => $request->content]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Period $period)
    {
        $period->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    public function store2(Request $request)
    {
        // $request->validate([
        //     'name' => 'required|unique:periods',
        //     'start_date' => '',
        //     'end_data' => '',
        //     'content' => 'required',
        // ]);

        try {
            $period = Period::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'content' => $request->content,
            ]);

            if ($request->has('deleteImage') && $request->deleteImage) {
                if ($period->image) {
                    $this->deleteFile($period->image->id);
                }
            }

            if ($request->has('files') && count($request->files) > 0) {
                if ($period->image) {
                    $this->deleteFile($period->image->id);
                }
                $this->storeFile($request, $period, 'general');
                $period->image()->update(['is_primary' => true]);
            }

            session()->flash('success', true);
            return redirect()->back()->with('success', 'Período criada com sucesso.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Erro ao criar período.');
        }
    }

    public function update2(Request $request, Period $period)
    {
        // request()->validate([
        //     'name' => 'required|unique:periods,name,' . $period->id,
        //     'start_date' => '',
        //     'end_data' => '',
        //     'content' => 'required',
        // ]);

        try {
            $period->update([
                'name' => request('name'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'content' => request('content'),
            ]);

            if ($request->has('deleteImage') && $request->deleteImage) {
                if ($period->image) {
                    $this->deleteFile($period->image->id);
                }
            }

            if ($request->has('files') && count($request->files) > 0) {
                if ($period->image) {
                    $this->deleteFile($period->image->id);
                }
                $this->storeFile($request, $period, 'general');
                $period->image()->update(['is_primary' => true]);
            }

            session()->flash('success', true);
            return redirect()->back()->with('success', 'Período atualizada com sucesso.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Erro ao atualizar período.');
        }
    }

    public function destroy2(Period $period)
    {
        try {
            $period->delete();
            return redirect()->back()->with('success', 'Período deletada com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao deletar período.');
        }
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        $options = Period::fetchAsSelectOption($request->search);
        return response()->json($options);
    }
}
