<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\HistoryArticleController;
use App\Http\Controllers\HomePublicController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\Public\PersonPublicController;
use App\Http\Controllers\Public\ReviewPublicController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', [HomePublicController::class, 'index'])->name('home');

Route::get('/critica', [ReviewPublicController::class, 'index'])->name('review-public.index');

Route::get('/pessoas', [PersonPublicController::class, 'index'])->name('person-public.index');
Route::get('/pessoas/{id}', [PersonPublicController::class, 'show'])->name('person-public.show');

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
    Route::get('/pessoas/{person:slug}', [PersonController::class, 'show'])->name('person.show');
    Route::get('/pessoas/{person:slug}/editar', [PersonController::class, 'edit'])->name('person.edit');
    Route::post('/pessoas/{person:slug}/update', [PersonController::class, 'update'])->name('person.update');
    Route::get('/pessoas/{person:slug}/editar/imagens', [PersonController::class, 'editImages'])->name('person.edit.images');
    Route::post('/pessoas/{person:slug}/update/images', [PersonController::class, 'updateImages'])->name('person.update.images');
    Route::get('/pessoas/{person:slug}/editar/conteudo', [PersonController::class, 'editContent'])->name('person.edit.content');
    Route::post('/pessoas/{person:slug}/update/content', [PersonController::class, 'updateContent'])->name('person.update.content');
    Route::delete('/pessoas/{person:slug}/delete', [PersonController::class, 'destroy'])->name('person.destroy');

    // Artworks
    Route::get('/obras', [ArtworkController::class, 'index'])->name('artwork.index');
    Route::get('/obras/criar', [ArtworkController::class, 'create'])->name('artwork.create');
    Route::post('/obras/store', [ArtworkController::class, 'store'])->name('artwork.store');
    Route::get('/obras/{artwork:slug}', [ArtworkController::class, 'show'])->name('artwork.show');
    Route::get('/obras/{artwork:slug}/editar', [ArtworkController::class, 'edit'])->name('artwork.edit');
    Route::post('/obras/{artwork:slug}/update', [ArtworkController::class, 'update'])->name('artwork.update');
    Route::get('/obras/{artwork:slug}/editar/pessoas', [ArtworkController::class, 'editPeople'])->name('artwork.edit.people');
    Route::post('/obras/{artwork:slug}/update/people', [ArtworkController::class, 'updatePeople'])->name('artwork.update.people');
    Route::get('/obras/{artwork:slug}/editar/imagens', [ArtworkController::class, 'editImages'])->name('artwork.edit.images');
    Route::post('/obras/{artwork:slug}/update/images', [ArtworkController::class, 'updateImages'])->name('artwork.update.images');
    Route::get('/obras/{artwork:slug}/editar/conteudo', [ArtworkController::class, 'editContent'])->name('artwork.edit.content');
    Route::post('/obras/{artwork:slug}/update/content', [ArtworkController::class, 'updateContent'])->name('artwork.update.content');
    Route::delete('/obras/{artwork:slug}/delete', [ArtworkController::class, 'destroy'])->name('artwork.destroy');

    // Reviews
    Route::get('/criticas', [ReviewController::class, 'index'])->name('review.index');
    Route::get('/criticas/criar', [ReviewController::class, 'create'])->name('review.create');
    Route::post('/criticas/store', [ReviewController::class, 'store'])->name('review.store');
    Route::get('/criticas/{review:slug}', [ReviewController::class, 'show'])->name('review.show');
    Route::get('/criticas/{review:slug}/editar', [ReviewController::class, 'edit'])->name('review.edit');
    Route::post('/criticas/{review:slug}/update', [ReviewController::class, 'update'])->name('review.update');
    Route::get('/criticas/{review:slug}/editar/imagens', [ReviewController::class, 'editImages'])->name('review.edit.images');
    Route::post('/criticas/{review:slug}/update/imagens', [ReviewController::class, 'updateImages'])->name('review.update.images');
    Route::get('/criticas/{review:slug}/editar/conteudo', [ReviewController::class, 'editContent'])->name('review.edit.content');
    Route::post('/criticas/{review:slug}/update/content', [ReviewController::class, 'updateContent'])->name('review.update.content');
    Route::delete('/criticas/{review:slug}/delete', [ReviewController::class, 'destroy'])->name('review.destroy');

    // History Articles
    Route::get('/historia-da-arte', [HistoryArticleController::class, 'index'])->name('historyArticle.index');
    Route::get('/historia-da-arte/criar', [HistoryArticleController::class, 'create'])->name('historyArticle.create');
    Route::post('/historia-da-arte/store', [HistoryArticleController::class, 'store'])->name('historyArticle.store');
    Route::get('/historia-da-arte/{historyArticle:slug}', [HistoryArticleController::class, 'show'])->name('historyArticle.show');
    Route::get('/historia-da-arte/{historyArticle:slug}/editar', [HistoryArticleController::class, 'edit'])->name('historyArticle.edit');
    Route::post('/historia-da-arte/{historyArticle:slug}/update', [HistoryArticleController::class, 'update'])->name('historyArticle.update');
    Route::get('/historia-da-arte/{historyArticle:slug}/editar/imagens', [HistoryArticleController::class, 'editImages'])->name('historyArticle.edit.images');
    Route::post('/historia-da-arte/{historyArticle:slug}/update/imagens', [HistoryArticleController::class, 'updateImages'])->name('historyArticle.update.images');
    Route::get('/historia-da-arte/{historyArticle:slug}/editar/conteudo', [HistoryArticleController::class, 'editContent'])->name('historyArticle.edit.content');
    Route::post('/historia-da-arte/{historyArticle:slug}/update/content', [HistoryArticleController::class, 'updateContent'])->name('historyArticle.update.content');
    Route::delete('/historia-da-arte/{historyArticle:slug}/delete', [HistoryArticleController::class, 'destroy'])->name('historyArticle.destroy');
});

// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
// require __DIR__ . '/public.php';
