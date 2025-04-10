<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ReviewController;
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

    Route::resource('/pessoas', PersonController::class)->names('person');
    Route::post('/pessoas/store/select', [PersonController::class, 'storeSelect'])->name('person.store.select');

    Route::resource('/artwork', ArtworkController::class)->names('artwork');

    Route::resource('/critica', ReviewController::class)->names('review');

    Route::resource('/work', WorkController::class)->names('work');
    Route::get('/work/{work:id}/edit/relations', [WorkController::class, 'editRelations'])->name('work.edit.relations');
    Route::post('/work/{work:id}/update/relations', [WorkController::class, 'updateRelations'])->name('work.update.relations');
    Route::get('/work/{work:id}/edit/images', [WorkController::class, 'editImages'])->name('work.edit.images');
    Route::post('/work/{work:id}/update/images', [WorkController::class, 'updateImages'])->name('work.update.images');
    Route::get('/work/{work:id}/edit/content', [WorkController::class, 'editContent'])->name('work.edit.content');
    Route::post('/work/{work:id}/update/content', [WorkController::class, 'updateContent'])->name('work.update.content');
    Route::get('/work/{work:id}/edit/people', [WorkController::class, 'editPeople'])->name('work.edit.people');
    Route::post('/work/{work:id}/update/people', [WorkController::class, 'updatePeople'])->name('work.update.people');
    Route::get('/work/{work:id}/edit/details', [WorkController::class, 'editDetails'])->name('work.edit.details');

    Route::delete('/work/{id}/delete', [WorkController::class, 'destroy'])->name('work.destroy');

    Route::post('/work/{work:id}/update/details/artwork', [ArtworkController::class, 'update'])->name('artwork.update');
});

// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
// require __DIR__ . '/public.php';
