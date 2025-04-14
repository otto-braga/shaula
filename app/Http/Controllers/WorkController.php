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
use App\Models\Artwork;
use App\Models\Award;
use App\Models\Category;
use App\Models\City;
use App\Models\Curation;
use App\Models\Exhibit;
use App\Models\Language;
use App\Models\Person;
use App\Models\Review;
use App\Models\Source;
use App\Models\Tag;
use App\Models\Work;
use App\Traits\HasFile;
use App\Traits\HasSlug;
use App\Traits\HasUuid;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class WorkController extends Controller
{
    use HasFile, HasSlug, HasUuid;

    const WORKABLE_TYPES = [
        ['value' => Artwork::class, 'label' => 'Obra'],
        ['value' => Review::class, 'label' => 'Crítica'],
        ['value' => Source::class, 'label' => 'Fonte'],
        ['value' => Curation::class, 'label' => 'Curadoria'],
        ['value' => Exhibit::class, 'label' => 'Exposição'],
    ];

    // -------------------------------------------------------------------------
    // BASE

    public function index()
    {
        $works = Work::query()
            ->with('workable')
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('admin/work/index', [
            'works' => WorkResource::collection($works),
        ]);
    }

    public function create()
    {
        $people = Person::query()
            ->orderBy('name')
            ->get();

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

        $work->authors()->syncWithPivotValues(
            $dataForm['authors_ids'],
            ['activity_id' => Activity::first()->id]
        );

        session()->flash('success', true);
        return redirect()->route('work.edit', $work->id);
    }

    public function show(Work $work)
    {
        //
    }

    public function edit(Work $work)
    {
        $work->load('authors');

        $people = Person::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/work/edit/index', [
            'work' => new WorkResource($work),
            'workable_types' => new JsonResource(self::WORKABLE_TYPES),
            'people' => PersonResource::collection($people),
        ]);
    }

    public function update(WorkUpdateRequest $request, Work $work)
    {
        $dataForm = $request->all();

        $work->update($dataForm);

        $work->authors()->syncWithPivotValues(
            $dataForm['authors_ids'],
            ['activity_id' => Activity::first()->id]
        );

        session()->flash('success', true);
        return redirect()->back();
    }

    public function destroy(Work $work)
    {
        $work->delete();

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // PEOPLE

    public function editPeople(Work $work)
    {
        $work->load('people');

        $activities = Activity::query()
            ->where('name', 'not like', 'autoria')
            ->get();

        $people = Person::query()
            ->get();

        return Inertia::render('admin/work/edit/people', [
            'work' => new WorkResource($work),
            'activities' => ActivityResource::collection($activities),
            'people' => PersonResource::collection($people),
        ]);
    }

    public function updatePeople(WorkUpdatePeopleRequest $request, Work $work)
    {
        $activities = $request->activities;

        if ($activities) {
            foreach ($activities as $activity) {
                if ($activity['people'] === null || count($activity['people']) < 1) {
                    $work->people()
                        ->wherePivot('activity_id', $activity['id'])
                        ->detach();
                    continue;
                }

                foreach ($activity['people'] as $person) {
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

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // RELATIONS

    public function editRelations(Work $work)
    {
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

    public function updateRelations(WorkUpdateRelationsRequest $request, Work $work)
    {
        $work->cities()->sync(Arr::pluck($request->cities, 'id'));
        $work->languages()->sync(Arr::pluck($request->languages, 'id'));
        $work->awards()->sync(Arr::pluck($request->awards, 'id'));
        $work->categories()->sync(Arr::pluck($request->categories, 'id'));
        $work->tags()->sync(Arr::pluck($request->tags, 'id'));

        session()->flash('success', true);
        return redirect()->back();
    }

    // -------------------------------------------------------------------------
    // IMAGES

    public function editImages(Work $work)
    {
        return Inertia::render('admin/work/edit/images', [
            'work' => new WorkResource($work),
        ]);
    }

    public function updateImages(WorkUpdateImagesRequest $request, Work $work)
    {
        try {
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

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // CONTENT

    public function editContent(Work $work)
    {
        return Inertia::render('admin/work/edit/content', [
            'work' => new WorkResource($work),
        ]);
    }

    public function updateContent(WorkUpdateContentRequest $request, Work $work)
    {
        try {
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

            session()->flash('success', true);
            return redirect()->back();
        } catch (\Throwable $e) {
            session()->flash('success', false);
            return redirect()->back();
        }
    }

    // -------------------------------------------------------------------------
    // DETAILS

    public function editDetails(Work $work)
    {
        $render = 'admin/work/' . strtolower(class_basename($work->workable_type)) . '/edit';

        return Inertia::render($render, [
            'work' => new WorkResource($work),
        ]);
    }

}
