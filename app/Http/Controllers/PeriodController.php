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
  
    public function create()
    {
        return Inertia::render('admin/period/edit');
    }

    public function store(Request $request)
    {
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
            return redirect()->route('periods.index')->with('success', 'Período criada com sucesso.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Erro ao criar período.');
        }
    }

    public function edit(Period $period)
    {
        return Inertia::render('admin/period/edit', [
            'period' => new PeriodResource($period),
        ]);
    }

    public function update(Request $request, Period $period)
    {
        // request()->validate([
        //     'name' => 'required|unique:periods,name,' . $period->id,
        //     'start_date' => '',
        //     'end_data' => '',
        //     'content' => 'required',
        // ]);

        // dd($request->all());

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
            return redirect()->route('periods.index')->with('success', 'Período atualizada com sucesso.');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Erro ao atualizar período.');
        }
    }

    public function destroy(Period $period)
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
