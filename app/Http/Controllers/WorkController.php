<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkStoreRequest;
use App\Http\Requests\WorkUpdateContentRequest;
use App\Http\Requests\WorkUpdateImagesRequest;
use App\Http\Requests\WorkUpdatePeopleRequest;
use App\Http\Requests\WorkUpdateRelationsRequest;
use App\Http\Requests\WorkUpdateRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\AwardResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CityResource;
use App\Http\Resources\LanguageResource;
use App\Http\Resources\PersonResource;
use App\Http\Resources\TagResource;
use App\Http\Resources\WorkResource;
use App\Models\Activity;
use App\Models\Award;
use App\Models\Category;
use App\Models\City;
use App\Models\Language;
use App\Models\Person;
use App\Models\Tag;
use App\Models\Work;
use App\Traits\HasFile;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class WorkController extends Controller
{
    use HasFile;

    const WORKABLE_TYPES = [
        ['value' => 'App\Models\Artwork', 'label' => 'Obra'],
        ['value' => 'App\Models\Review', 'label' => 'Crítica'],
        ['value' => 'App\Models\Source', 'label' => 'Fonte'],
        ['value' => 'App\Models\Curation', 'label' => 'Curadoria'],
        ['value' => 'App\Models\Exhibit', 'label' => 'Exposição'],
    ];

    public function index()
    {
        $works = Work::all();

        return Inertia::render('admin/work/index', [
            'works' => WorkResource::collection($works),
        ]);
    }

    public function create()
    {
        $people = Person::all();

        return Inertia::render('admin/work/edit/index', [
            'workable_types' => new JsonResource(self::WORKABLE_TYPES),
            'people' => PersonResource::collection($people),
        ]);
    }

    public function store(WorkStoreRequest $request)
    {
        $dataForm = $request->all();


        $workable = $dataForm['workable_type']::create();
        $dataForm['workable_id'] = $workable->id;

        $work = Work::create($dataForm);

        $work->people()->syncWithPivotValues(
            $dataForm['authors_ids'],
            ['activity_id' => Activity::where('name', 'autoria')->first()->id]
        );

        return redirect()->route('work.edit', $work->uuid)->with('success', 'true');
    }

    public function show(Work $work)
    {
        //
    }

    public function edit(Work $work)
    {
        $work->load('authors');

        $people = Person::all();

        return Inertia::render('admin/work/edit/index', [
            'work' => new WorkResource($work),
            'workable_types' => new JsonResource(self::WORKABLE_TYPES),
            'people' => PersonResource::collection($people),
        ]);
    }

    public function update(WorkUpdateRequest $request, $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        $dataForm = $request->all();

        $work->update($dataForm);

        $authors_ids = $dataForm['authors_ids'];

        foreach ($request->new_people_names as $new_person_name) {
            $new_person = Person::create(['name' => $new_person_name]);
            array_push($authors_ids, $new_person->id);
        }

        $work->people()->syncWithPivotValues(
            $authors_ids,
            ['activity_id' => Activity::where('name', 'autoria')->first()->id]
        );

        return redirect()->back()->with('success', 'true');
    }

    public function editRelations(String $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();
        $cities = City::all();
        $languages = Language::all();
        $awards = Award::all();
        $categories = Category::where('class', $work->workable_type)->get();
        $tags = Tag::all();

        return Inertia::render('admin/work/edit/relations', [
            'work' => new WorkResource($work),
            'cities' => CityResource::collection($cities),
            'languages' => LanguageResource::collection($languages),
            'awards' => AwardResource::collection($awards),
            'categories' => CategoryResource::collection($categories),
            'tags' => TagResource::collection($tags),
        ]);
    }

    public function updateRelations(WorkUpdateRelationsRequest $request, $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        $cities = $request->cities;
        foreach ($cities as $key => $city) {
            if ($city['id'] < 1) {
                $newCity = City::create(['name' => $city['name']]);
                $cities[$key]['id'] = $newCity->id;
            }
        }
        $work->cities()->sync(Arr::pluck($cities, 'id'));

        $languages = $request->languages;
        foreach ($languages as $key => $language) {
            if ($language['id'] < 1) {
                $newLanguage = Language::create(['name' => $language['name']]);
                $languages[$key]['id'] = $newLanguage->id;
            }
        }
        $work->languages()->sync(Arr::pluck($languages, 'id'));

        $awards = $request->awards;
        foreach ($awards as $key => $award) {
            if ($award['id'] < 1) {
                $newAward = Award::create(['name' => $award['name']]);
                $awards[$key]['id'] = $newAward->id;
            }
        }
        $work->awards()->sync(Arr::pluck($awards, 'id'));

        $categories = $request->categories;
        foreach ($categories as $key => $category) {
            if ($category['id'] < 1) {
                $newCategory = Category::create([
                    'name' => $category['name'],
                    'class' => $work->workable_type
                ]);
                $categories[$key]['id'] = $newCategory->id;
            }
        }
        $work->categories()->sync(Arr::pluck($categories, 'id'));

        $tags = $request->tags;
        foreach ($tags as $key => $tag) {
            if ($tag['id'] < 1) {
                $newTag = Tag::create(['name' => $tag['name']]);
                $tags[$key]['id'] = $newTag->id;
            }
        }
        $work->tags()->sync(Arr::pluck($tags, 'id'));

        return redirect()->back();
    }

    public function editImages(String $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        return Inertia::render('admin/work/Edit/Images', [
            'work' => new WorkResource($work),
        ]);
    }

    public function updateImages(WorkUpdateImagesRequest $request, String $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        if ($request->has('files') && count($request->files) > 0) {
            $this->storeFile(
                $request,
                $work->id,
                Work::class,
                $work->uuid,
                'general'
            );
        }

        if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
            foreach ($request->filesToRemove as $fileId) {
                $this->deleteFile($fileId);
            }
        }

        return redirect()->back()->with('success', 'true');
    }

    public function editContent(String $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        return Inertia::render('admin/work/Edit/Content', [
            'work' => new WorkResource($work),
        ]);
    }

    public function updateContent(WorkUpdateContentRequest $request, $uuid)
    {
        try {
            $work = Work::where('uuid', $uuid)->first();

            if ($request->has('files') && count($request->files) > 0) {
                $this->storeFile(
                    $request,
                    $work->id,
                    Work::class,
                    $work->uuid,
                    'content'
                );
            }

            if ($request->has('filesToRemove') && count($request->filesToRemove) > 0) {
                foreach ($request->filesToRemove as $fileId) {
                    $this->deleteFile($fileId);
                }
            }

            $work->update(['content' => $request->content]);

            return redirect()->back()->with('success', 'true');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'true');
        }
    }

    public function editPeople(String $uuid)
    {
        $work = Work::where('uuid', $uuid)->first()
            ->load(
                'people'
            );

        $activities = Activity::query()
            ->where('name', 'not like', 'autoria')
            ->get();

        $people = Person::query()
            ->get();

        return Inertia::render('admin/work/Edit/People', [
            'work' => new WorkResource($work),
            'activities' => ActivityResource::collection($activities),
            'people' => PersonResource::collection($people),
        ]);
    }

    public function updatePeople(WorkUpdatePeopleRequest $request, $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        $activities = $request->activities;

        if ($activities) {
            foreach ($activities as $activity) {
                if ($activity['id'] < 0) {
                    $new_activity = Activity::create(['name' => $activity['name']]);
                    $activity['id'] = $new_activity->id;
                }

                foreach ($activity['people'] as $person) {
                    if ($person['id'] < 0) {
                        $new_person = Person::create(['name' => $person['name']]);
                        $person['id'] = $new_person->id;
                    }

                    if (in_array($person['id'], $work->people->pluck('id')->toArray())) {
                        if (
                            !in_array(
                                $activity['id'],
                                $work->people->where('id', $person['id'])
                                    ->pluck('pivot.activity_id')->toArray()
                            )
                        ) {
                            $work->people()->attach(
                                $person['id'],
                                ['activity_id' => $activity['id']]
                            );
                        }
                    } else {
                        $work->people()->attach(
                            $person['id'],
                            ['activity_id' => $activity['id']]
                        );
                    }
                }
            }

            $work->people()
                ->wherePivotNotIn('activity_id', collect($activities)->pluck('id'))
                ->detach();

            foreach ($work->people as $person) {
                if (
                    !in_array(
                        $person->id,
                        collect($activities)->pluck('people')
                            ->flatten(1)->pluck('id')->toArray()
                    )
                ) {
                    $work->people()->detach($person->id);
                }
            }
        }

        return redirect()->back()->with('success', 'true');
    }

    public function editDetails(String $uuid)
    {
        $work = Work::where('uuid', $uuid)->first();

        if (class_basename($work->workable_type) === 'Review') {
            return redirect()->back();
        }

        $render = 'admin/work/Edit/Details/' . class_basename($work->workable_type);

        return Inertia::render($render, [
            'work' => new WorkResource($work),
        ]);
    }

    // public function updateDetails(WorkUpdateDetailsRequest $request, $uuid)
    // {
    //     return redirect()->back();
    // }

    public function destroy(Work $work)
    {
        $work->delete();

        return redirect()->back()->with('success', 'true');
    }
}
