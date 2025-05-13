<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\PersonResource;
use App\Models\City;
use App\Models\Gender;
use App\Models\Person;
use App\Models\Period;
use App\Http\Resources\PeriodResource;
use App\Models\Mention;
use App\Traits\HasFile;
use App\Traits\HasMention;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class PersonController extends Controller
{
    use HasFile, HasMention;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $people = Person::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/person/index', [
            'people' => PersonResource::collection($people),
        ]);
    }

    // -------------------------------------------------------------------------
    // SHOW

    // public function show(Person $person)
    // {
    // }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        return Inertia::render('admin/person/edit/index');
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        try {
            $person = Person::create($dataForm);

            $person->genders()->sync($request->genders_ids);
            $person->cities()->sync($request->cities_ids);
            $person->periods()->sync($request->periods_ids);

            session()->flash('success', true);
            return redirect()->route('people.edit', $person->slug);
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Person $person)
    {
        return Inertia::render('admin/person/edit/index', [
            'person' => new PersonResource($person),
        ]);
    }

    public function update(Request $request, Person $person)
    {
        $dataForm = $request->all();

        $person->update($dataForm);

        $person->genders()->sync($request->genders_ids);
        $person->cities()->sync($request->cities_ids);
        $person->periods()->sync($request->periods_ids);

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT IMAGES

    public function editImages(Person $person)
    {
        return Inertia::render('admin/person/edit/images', [
            'person' => new PersonResource($person),
        ]);
    }

    public function updateImages(Request $request, Person $person)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $person, 'general');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            if ($person->images()->count() > 0) {
                $person->images()->update(['is_primary' => false]);
                if ($request->primaryImageId > 0) {
                    $person->images()->where('id', $request->primaryImageId)->update(['is_primary' => true]);
                } else {
                    $person->images()->first()->update(['is_primary' => true]);
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

    public function editContent(Person $person)
    {
        return Inertia::render('admin/person/edit/content', [
            'person' => new PersonResource($person),
        ]);
    }

    public function updateContent(Request $request, Person $person)
    {
        try {
            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile($request, $person, 'content');
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $person->update([
                'content' => $request->content,
                'chronology' => $request->chronology,
            ]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // EDIT MENTIONS

    public function editMentions(Person $person)
    {
        $person->load('mentioned');

        $mentionQueries = $this->getMentionQueries();

        return Inertia::render('admin/person/edit/mentions', [
            'person' => new PersonResource($person),
            'mention_queries' => new JsonResource($mentionQueries),
        ]);
    }

    public function updateMentions(Request $request, Person $person)
    {
        $person->mentioned()->delete();

        foreach ($request->mentions as $mention) {
            Mention::create([
                'mentioned_id' => $mention['mentioned_id'],
                'mentioned_type' => $mention['mentioned_type'],
                'mentioner_id' => $person->id,
                'mentioner_type' => $person::class
            ]);
        }

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Person $person)
    {
        $person->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // FETCH

    public function fetchSelectOptions(Request $request)
    {
        $options = Person::fetchAsSelectOption($request->search);
        return response()->json($options);
    }
}
