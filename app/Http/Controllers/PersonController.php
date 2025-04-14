<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PersonResource;
use App\Models\Activity;
use App\Models\Review;
use App\Models\Category;
use App\Models\City;
use App\Models\Gender;
use App\Models\Person;
use App\Traits\HasFile;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class PersonController extends Controller
{

    use HasFile;

    // -------------------------------------------------------------------------
    // INDEX

    public function index()
    {
        $people = Person::query()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('admin/person/index', [
            'people' => PersonResource::collection($people),
        ]);
    }

    public function show(Person $person)
    {
        //
    }

    // -------------------------------------------------------------------------
    // CREATE

    public function create()
    {
        $genders = Gender::all();
        $cities = City::all();

        return Inertia::render('admin/person/edit/index', [
            'genders' => JsonResource::collection($genders),
            'cities' => JsonResource::collection($cities)
        ]);
    }

    public function store(Request $request)
    {
        $dataForm = $request->all();

        $person = Person::create($dataForm);

        $person->genders()->sync(Arr::pluck($request->genders, 'id'));
        $person->cities()->sync(Arr::pluck($request->cities, 'id'));

        session()->flash('success', true);
        return redirect()->route('person.edit', $person->id);
    }

    // -------------------------------------------------------------------------
    // EDIT

    public function edit(Person $person)
    {
        $genders = Gender::all();
        $cities = City::all();

        return Inertia::render('admin/person/edit/index', [
            'person' => new PersonResource($person),
            'genders' => JsonResource::collection($genders),
            'cities' => JsonResource::collection($cities)
        ]);
    }

    public function update(Request $request, Person $person)
    {
        // dd($request->all());

        $dataForm = $request->all();

        $person->update($dataForm);

        $person->genders()->sync(Arr::pluck($request->genders, 'id'));
        $person->cities()->sync(Arr::pluck($request->cities, 'id'));

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // EDIT PEOPLE

    // public function editPeople(Review $review)
    // {
    //     $review->load('people');

    //     $activities = Activity::query()
    //         ->where('name', 'not like', 'autoria')
    //         ->get();

    //     $people = Person::query()
    //         ->get();

    //     return Inertia::render('admin/review/edit/people', [
    //         'review' => new ReviewResource($review),
    //         'activities' => ActivityResource::collection($activities),
    //         'people' => PersonResource::collection($people),
    //     ]);
    // }

    // public function updatePeople(Request $request, Review $review)
    // {
    //     $activities = $request->activities;

    //     if ($activities) {
    //         foreach ($activities as $activity) {
    //             if ($activity['people'] === null || count($activity['people']) < 1) {
    //                 $review->people()
    //                     ->wherePivot('activity_id', $activity['id'])
    //                     ->detach();
    //                 continue;
    //             }

    //             foreach ($activity['people'] as $person) {
    //                 if (in_array($person['id'], $review->people->pluck('id')->toArray())) {
    //                     if (
    //                         !in_array(
    //                             $activity['id'],
    //                             $review->people->where('id', $person['id'])
    //                                 ->pluck('pivot.activity_id')->toArray()
    //                         )
    //                     ) {
    //                         $review->people()->attach(
    //                             $person['id'],
    //                             ['activity_id' => $activity['id']]
    //                         );
    //                     }
    //                 } else {
    //                     $review->people()->attach(
    //                         $person['id'],
    //                         ['activity_id' => $activity['id']]
    //                     );
    //                 }
    //             }
    //         }

    //         $review->people()
    //             ->wherePivotNotIn('activity_id', collect($activities)->pluck('id'))
    //             ->detach();

    //         foreach ($review->people as $person) {
    //             if (
    //                 !in_array(
    //                     $person->id,
    //                     collect($activities)->pluck('people')
    //                         ->flatten(1)->pluck('id')->toArray()
    //                 )
    //             ) {
    //                 $review->people()->detach($person->id);
    //             }
    //         }
    //     }

    //     session()->flash('success', true);
    //     return redirect()->back();
    // }

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
                $this->storeFile(
                    $request,
                    $person->id,
                    Person::class,
                    $person->uuid,
                    'general'
                );
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
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
                $this->storeFile(
                    $request,
                    $person->id,
                    Person::class,
                    $person->uuid,
                    'content'
                );
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $person->update(['content' => $request->content]);

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DELETE

    public function destroy(Person $person)
    {
        $person->delete();

        session()->flash('success', true);
        return redirect()->back();
    }
}

//     public function index()
//     {
//         $people = Person::query()
//             ->orderBy('created_at', 'desc')
//             ->paginate(12);

//         return Inertia::render('admin/people/index', [
//             'people' => PersonResource::collection($people)
//         ]);
//     }

//     public function create()
//     {
//         $genders = Gender::all();
//         $cities = City::all();
//         return Inertia::render('admin/people/edit', [
//             'genders' => $genders,
//             'cities' => $cities,
//         ]);
//     }

//     public function store(Request $request)
//     {

//         $request->validate([
//             'name' => 'required|string|max:255',
//             'date_of_birth' => 'date',
//             'date_of_death' => 'nullable|date',
//             'bio' => 'nullable',
//             'chrono' => 'nullable|string',
//         ]);



//         try {
//             DB::transaction(function () use ($request) {
//                 $person = Person::create([
//                     'name' => $request->name,
//                     'date_of_birth' => $request->date_of_birth,
//                     'date_of_death' => $request->date_of_death,
//                     'bio' => $request->bio,
//                     'chrono' => $request->chrono,
//                 ]);


//                 foreach ($request->genders as $gender) {
//                     $person->genders()->attach($gender['value']);
//                 }

//                 if ($request->hasFile('image')) {

//                     $path = $request->image->store('people', 'public');

//                     $uploadedImage = File::create([
//                         'fileable_id' => $person->id,
//                         'fileable_type' => Person::class,
//                         'name' => $request->image->hashName(),
//                         'original_name' => $request->image->getClientOriginalName(),
//                         'mime_type' => $request->image->getClientMimeType(),
//                         'path' =>  $path,
//                         'collection' => 'images',
//                         'size' => $request->image->getSize(),
//                     ]);

//                     $uploadedImage->save();
//                 }
//             });
//             return redirect()
//                 ->route('person.index')
//                 ->with('success', 'Pessoa criada com sucesso!');
//         } catch (\Exception $e) {
//             dd($e->getMessage());
//             return redirect()
//                 ->back()
//                 ->with('error', 'Erro ao criar a pessoa: ' . $e->getMessage());
//         }
//     }

//     public function show(String $uuid)
//     {
//         // $person = Person::where('uuid', $uuid)->first();

//         // $genders = Gender::all();
//         // $cities = City::all();

//         // return Inertia::render('admin/people/show', [
//         //     'person' => new PersonResource($person),
//         //     'genders' => $genders,
//         //     'cities' => $cities,
//         // ]);
//     }

//     public function edit($uuid)
//     {
//         $person = Person::where('uuid', $uuid)->first();

//         $genders = Gender::all();
//         $cities = City::all();

//         return Inertia::render('admin/people/edit', [
//             'person' => new PersonResource($person),
//             'genders' => $genders,
//             'cities' => $cities,
//         ]);
//     }

//     public function update(Request $request, $uuid)
//     {
//         $person = Person::where('uuid', $uuid)->first();

//         $request->validate([
//             'name' => 'required|string|max:255',
//             'date_of_birth' => 'date',
//             'date_of_death' => 'nullable|date',
//             'bio' => 'nullable',
//             'chrono' => 'nullable|string',
//         ]);

//         try {
//             DB::transaction(function () use ($request, $person) {
//                 $person->update([
//                     'name' => $request->name,
//                     'date_of_birth' => $request->date_of_birth,
//                     'date_of_death' => $request->date_of_death,
//                     'bio' => $request->bio,
//                     'chrono' => $request->chrono,
//                 ]);

//                 if ($request->has('genders')) {
//                     foreach ($request->genders as $gender) {
//                         $person->genders()->sync($gender['value']);
//                     }
//                 }




//                 // $dataForm = $request->all();

//                 // $person->update($dataForm);

//                 // // $person->genders()->sync($request->genders);






//                 if ($request->hasFile('image')) {

//                     $person->image()->delete();

//                     $path = $request->image->store('people', 'public');

//                     $uploadedImage = File::create([
//                         'fileable_id' => $person->id,
//                         'fileable_type' => Person::class,
//                         'name' => $request->image->hashName(),
//                         'original_name' => $request->image->getClientOriginalName(),
//                         'mime_type' => $request->image->getClientMimeType(),
//                         'path' =>  $path,
//                         'collection' => 'images',
//                         'size' => $request->image->getSize(),
//                     ]);

//                     $uploadedImage->save();
//                 }
//             });
//             return redirect()
//                 ->route('person.index')
//                 ->with('success', 'Pessoa editada com sucesso!');
//         } catch (\Exception $e) {
//             dd($e->getMessage());
//             return redirect()
//                 ->back()
//                 ->with('error', 'Erro ao editar a pessoa: ' . $e->getMessage());
//         }
//     }

//     public function destroy($uuid)
//     {
//         $person = Person::where('uuid', $uuid)->first();

//         try {
//             DB::transaction(function () use ($person) {
//                 $person->image()->delete();
//                 $person->delete();
//             });
//             return redirect()
//                 ->route('person.index')
//                 ->with('success', 'Pessoa deletada com sucesso!');
//         } catch (\Exception $e) {
//             dd($e->getMessage());
//             return redirect()
//                 ->back()
//                 ->with('error', 'Erro ao deletar a pessoa: ' . $e->getMessage());
//         }
//     }
// }
