<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route::get('/', [HomeController::class, 'index'])->name('home');

// Route::get('publicacoes', [PostPublicController::class, 'index'])->name('posts-public.index');
// Route::get('publicacoes/{slug}', [PostPublicController::class, 'show'])->name('posts-public.show');

// Route::get('galeria', [ArtworkPublicController::class, 'index'])->name('artworks-public.index');
// Route::get('galeria/{slug}', [ArtworkPublicController::class, 'show'])->name('artworks-public.show');

// Route::get('busca', [SearchController::class, 'index'])->name('search.index');

Route::group(['middleware' => ['auth', 'verified'], 'prefix' => 'admin', 'as' => ''], function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    //Tags
    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('tags', [TagController::class, 'store'])->name('tags.store');
    Route::put('tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    //Categories
    Route::get('categorias', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categorias/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categorias/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::resource('/pessoas', PersonController::class)->names('person');
    Route::post('/pessoas/store/select', [PersonController::class, 'storeSelect'])->name('person.store.select');

    //Genders
    Route::get('generos', [GenderController::class, 'index'])->name('genders.index');
    Route::post('generos', [GenderController::class, 'store'])->name('genders.store');
    Route::put('generos/{gender}', [GenderController::class, 'update'])->name('genders.update');
    Route::delete('generos/{gender}', [GenderController::class, 'destroy'])->name('genders.destroy');

    //Actitivies
    Route::get('atividades', [ActivityController::class, 'index'])->name('activities.index');
    Route::post('atividades', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('atividades/{activity}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('atividades/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');

    //Cities
    Route::get('cidades', [CityController::class, 'index'])->name('cities.index');
    Route::post('cidades', [CityController::class, 'store'])->name('cities.store');
    Route::put('cidades/{city}', [CityController::class, 'update'])->name('cities.update');
    Route::delete('cidades/{city}', [CityController::class, 'destroy'])->name('cities.destroy');

    //Languages
    Route::get('linguagens', [LanguageController::class, 'index'])->name('languages.index');
    Route::post('linguagens', [LanguageController::class, 'store'])->name('languages.store');
    Route::put('linguagens/{language}', [LanguageController::class, 'update'])->name('languages.update');
    Route::delete('linguagens/{language}', [LanguageController::class, 'destroy'])->name('languages.destroy');


    Route::resource('/artwork', ArtworkController::class)->names('artwork');

    Route::resource('/criticas', ReviewController::class)->names('review');

    Route::get('/work', [WorkController::class, 'index'])->name('work.index');
    Route::get('/work/create', [WorkController::class, 'create'])->name('work.create');
    Route::post('/work/store', [WorkController::class, 'store'])->name('work.store');
    Route::get('/work/{work:id}', [WorkController::class, 'show'])->name('work.show');
    Route::get('/work/{work:id}/edit', [WorkController::class, 'edit'])->name('work.edit');
    Route::post('/work/{work:id}/update', [WorkController::class, 'update'])->name('work.update');
    Route::get('/work/{work:id}/edit/people', [WorkController::class, 'editPeople'])->name('work.edit.people');
    Route::post('/work/{work:id}/update/people', [WorkController::class, 'updatePeople'])->name('work.update.people');
    Route::get('/work/{work:id}/edit/relations', [WorkController::class, 'editRelations'])->name('work.edit.relations');
    Route::post('/work/{work:id}/update/relations', [WorkController::class, 'updateRelations'])->name('work.update.relations');
    Route::get('/work/{work:id}/edit/images', [WorkController::class, 'editImages'])->name('work.edit.images');
    Route::post('/work/{work:id}/update/images', [WorkController::class, 'updateImages'])->name('work.update.images');
    Route::get('/work/{work:id}/edit/content', [WorkController::class, 'editContent'])->name('work.edit.content');
    Route::post('/work/{work:id}/update/content', [WorkController::class, 'updateContent'])->name('work.update.content');
    Route::delete('/work/{work:id}/delete', [WorkController::class, 'destroy'])->name('work.destroy');

    Route::get('/work/{work:id}/edit/details', [WorkController::class, 'editDetails'])->name('work.edit.details');
    Route::post('/work/{work:id}/update/details/artwork', [ArtworkController::class, 'update'])->name('artwork.update');
});

// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
// require __DIR__ . '/public.php';
