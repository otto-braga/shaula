<?php

namespace App\Http\Controllers;

use App\Http\Resources\PersonResource;
use App\Models\City;
use App\Models\File;
use App\Models\Gender;
use App\Models\Person;
use App\Traits\HasFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PersonController extends Controller
{

    use HasFile;

    public function index()
    {
        $people = Person::query()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('admin/people/index', [
            'people' => PersonResource::collection($people)
        ]);
    }

    public function create()
    {
        $genders = Gender::all();
        $cities = City::all();
        return Inertia::render('admin/people/edit', [
            'genders' => $genders,
            'cities' => $cities,
        ]);
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'date_of_birth' => 'date',
            'date_of_death' => 'nullable|date',
            'bio' => 'nullable',
            'chrono' => 'nullable|string',
        ]);



        try {
            DB::transaction(function () use ($request) {
                $person = Person::create([
                    'name' => $request->name,
                    'date_of_birth' => $request->date_of_birth,
                    'date_of_death' => $request->date_of_death,
                    'bio' => $request->bio,
                    'chrono' => $request->chrono,
                ]);


                foreach ($request->genders as $gender) {
                    $person->genders()->attach($gender['value']);
                }

                if ($request->hasFile('image')) {

                    $path = $request->image->store('people', 'public');

                    $uploadedImage = File::create([
                        'fileable_id' => $person->id,
                        'fileable_type' => Person::class,
                        'name' => $request->image->hashName(),
                        'original_name' => $request->image->getClientOriginalName(),
                        'mime_type' => $request->image->getClientMimeType(),
                        'path' =>  $path,
                        'collection' => 'images',
                        'size' => $request->image->getSize(),
                    ]);

                    $uploadedImage->save();
                }
            });
            return redirect()
                ->route('person.index')
                ->with('success', 'Pessoa criada com sucesso!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Erro ao criar a pessoa: ' . $e->getMessage());
        }
    }

    public function show(String $uuid)
    {
        // $person = Person::where('uuid', $uuid)->first();

        // $genders = Gender::all();
        // $cities = City::all();

        // return Inertia::render('admin/people/show', [
        //     'person' => new PersonResource($person),
        //     'genders' => $genders,
        //     'cities' => $cities,
        // ]);
    }

    public function edit($uuid)
    {
        $person = Person::where('uuid', $uuid)->first();

        $genders = Gender::all();
        $cities = City::all();

        return Inertia::render('admin/people/edit', [
            'person' => new PersonResource($person),
            'genders' => $genders,
            'cities' => $cities,
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $person = Person::where('uuid', $uuid)->first();

        $request->validate([
            'name' => 'required|string|max:255',
            'date_of_birth' => 'date',
            'date_of_death' => 'nullable|date',
            'bio' => 'nullable',
            'chrono' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($request, $person) {
                $person->update([
                    'name' => $request->name,
                    'date_of_birth' => $request->date_of_birth,
                    'date_of_death' => $request->date_of_death,
                    'bio' => $request->bio,
                    'chrono' => $request->chrono,
                ]);

                if ($request->has('genders')) {
                    foreach ($request->genders as $gender) {
                        $person->genders()->sync($gender['value']);
                    }
                }




                // $dataForm = $request->all();

                // $person->update($dataForm);

                // // $person->genders()->sync($request->genders);






                if ($request->hasFile('image')) {

                    $person->image()->delete();

                    $path = $request->image->store('people', 'public');

                    $uploadedImage = File::create([
                        'fileable_id' => $person->id,
                        'fileable_type' => Person::class,
                        'name' => $request->image->hashName(),
                        'original_name' => $request->image->getClientOriginalName(),
                        'mime_type' => $request->image->getClientMimeType(),
                        'path' =>  $path,
                        'collection' => 'images',
                        'size' => $request->image->getSize(),
                    ]);

                    $uploadedImage->save();
                }
            });
            return redirect()
                ->route('person.index')
                ->with('success', 'Pessoa editada com sucesso!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Erro ao editar a pessoa: ' . $e->getMessage());
        }
    }

    public function destroy($uuid)
    {
        $person = Person::where('uuid', $uuid)->first();

        try {
            DB::transaction(function () use ($person) {
                $person->image()->delete();
                $person->delete();
            });
            return redirect()
                ->route('person.index')
                ->with('success', 'Pessoa deletada com sucesso!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect()
                ->back()
                ->with('error', 'Erro ao deletar a pessoa: ' . $e->getMessage());
        }
    }
}
