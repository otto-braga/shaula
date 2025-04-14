<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\HomePublicController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\Public\PersonPublicController;
use App\Http\Controllers\Public\ReviewPublicController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', [HomePublicController::class, 'index'])->name('home');

Route::get('/critica', [ReviewPublicController::class, 'index'])->name('review-public.index');

Route::get('/pessoas', [PersonPublicController::class, 'index'])->name('person-public.index');

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

    // Tags
    Route::get('tags', [TagController::class, 'index'])->name('tags.index');
    Route::post('tags', [TagController::class, 'store'])->name('tags.store');
    Route::put('tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    // Categories
    Route::get('categorias', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categorias/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categorias/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Genders
    Route::get('generos', [GenderController::class, 'index'])->name('genders.index');
    Route::post('generos', [GenderController::class, 'store'])->name('genders.store');
    Route::put('generos/{gender}', [GenderController::class, 'update'])->name('genders.update');
    Route::delete('generos/{gender}', [GenderController::class, 'destroy'])->name('genders.destroy');

    // Actitivies
    Route::get('atividades', [ActivityController::class, 'index'])->name('activities.index');
    Route::post('atividades', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('atividades/{activity}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('atividades/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');

    // Cities
    Route::get('cidades', [CityController::class, 'index'])->name('cities.index');
    Route::post('cidades', [CityController::class, 'store'])->name('cities.store');
    Route::put('cidades/{city}', [CityController::class, 'update'])->name('cities.update');
    Route::delete('cidades/{city}', [CityController::class, 'destroy'])->name('cities.destroy');

    // Languages
    Route::get('linguagens', [LanguageController::class, 'index'])->name('languages.index');
    Route::post('linguagens', [LanguageController::class, 'store'])->name('languages.store');
    Route::put('linguagens/{language}', [LanguageController::class, 'update'])->name('languages.update');
    Route::delete('linguagens/{language}', [LanguageController::class, 'destroy'])->name('languages.destroy');

    // People
    Route::get('/pessoas', [PersonController::class, 'index'])->name('person.index');
    Route::get('/pessoas/criar', [PersonController::class, 'create'])->name('person.create');
    Route::post('/pessoas/store', [PersonController::class, 'store'])->name('person.store');
    Route::get('/pessoas/{person:id}', [PersonController::class, 'show'])->name('person.show');
    Route::get('/pessoas/{person:id}/editar', [PersonController::class, 'edit'])->name('person.edit');
    Route::post('/pessoas/{person:id}/update', [PersonController::class, 'update'])->name('person.update');
    Route::get('/pessoas/{person:id}/edit/images', [PersonController::class, 'editImages'])->name('person.edit.images');
    Route::post('/pessoas/{person:id}/update/images', [PersonController::class, 'updateImages'])->name('person.update.images');
    Route::get('/pessoas/{person:id}/edit/content', [PersonController::class, 'editContent'])->name('person.edit.content');
    Route::post('/pessoas/{person:id}/update/content', [PersonController::class, 'updateContent'])->name('person.update.content');
    Route::delete('/pessoas/{person:id}/delete', [PersonController::class, 'destroy'])->name('person.destroy');

    // Artworks
    Route::get('/artwork', [ArtworkController::class, 'index'])->name('artwork.index');
    Route::get('/artwork/create', [ArtworkController::class, 'create'])->name('artwork.create');
    Route::post('/artwork/store', [ArtworkController::class, 'store'])->name('artwork.store');
    Route::get('/artwork/{artwork:id}', [ArtworkController::class, 'show'])->name('artwork.show');
    Route::get('/artwork/{artwork:id}/edit', [ArtworkController::class, 'edit'])->name('artwork.edit');
    Route::post('/artwork/{artwork:id}/update', [ArtworkController::class, 'update'])->name('artwork.update');
    Route::get('/artwork/{artwork:id}/edit/people', [ArtworkController::class, 'editPeople'])->name('artwork.edit.people');
    Route::post('/artwork/{artwork:id}/update/people', [ArtworkController::class, 'updatePeople'])->name('artwork.update.people');
    Route::get('/artwork/{artwork:id}/edit/images', [ArtworkController::class, 'editImages'])->name('artwork.edit.images');
    Route::post('/artwork/{artwork:id}/update/images', [ArtworkController::class, 'updateImages'])->name('artwork.update.images');
    Route::get('/artwork/{artwork:id}/edit/content', [ArtworkController::class, 'editContent'])->name('artwork.edit.content');
    Route::post('/artwork/{artwork:id}/update/content', [ArtworkController::class, 'updateContent'])->name('artwork.update.content');
    Route::delete('/artwork/{artwork:id}/delete', [ArtworkController::class, 'destroy'])->name('artwork.destroy');

    // Reviews
    Route::get('/review', [ReviewController::class, 'index'])->name('review.index');
    Route::get('/review/create', [ReviewController::class, 'create'])->name('review.create');
    Route::post('/review/store', [ReviewController::class, 'store'])->name('review.store');
    Route::get('/review/{review:id}', [ReviewController::class, 'show'])->name('review.show');
    Route::get('/review/{review:id}/edit', [ReviewController::class, 'edit'])->name('review.edit');
    Route::post('/review/{review:id}/update', [ReviewController::class, 'update'])->name('review.update');
    Route::post('/review/{review:id}/update/relations', [ReviewController::class, 'updateRelations'])->name('review.update.relations');
    Route::get('/review/{review:id}/edit/images', [ReviewController::class, 'editImages'])->name('review.edit.images');
    Route::post('/review/{review:id}/update/images', [ReviewController::class, 'updateImages'])->name('review.update.images');
    Route::get('/review/{review:id}/edit/content', [ReviewController::class, 'editContent'])->name('review.edit.content');
    Route::post('/review/{review:id}/update/content', [ReviewController::class, 'updateContent'])->name('review.update.content');
    Route::delete('/review/{review:id}/delete', [ReviewController::class, 'destroy'])->name('review.destroy');
});

// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
// require __DIR__ . '/public.php';
