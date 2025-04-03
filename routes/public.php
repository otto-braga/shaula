<?php

use App\Http\Controllers\HomePublicController;
use App\Http\Controllers\Public\ArtworkPublicController;
use App\Http\Controllers\Public\PersonPublicController;
use App\Http\Controllers\Public\ReviewPublicController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => '', 'as' => 'public.'], function () {

    Route::get('/', [HomePublicController::class, 'index'])->name('home');

    // Route::resource('/critica', ReviewPublicController::class)->only(['index', 'show'])->names('review');
    Route::get('/critica', [ReviewPublicController::class, 'index'])->name('review.index');
    Route::get('/critica/{uuid}', [ReviewPublicController::class, 'show'])->name('review.show');

    Route::get('/pessoas', [PersonPublicController::class, 'index'])->name('person.index');
    Route::get('/pessoas/{slug}', [PersonPublicController::class, 'show'])->name('person.show');

    Route::get('/obras', [ArtworkPublicController::class, 'index'])->name('artwork.index');
    Route::get('/obras/{uuid}', [ArtworkPublicController::class, 'show'])->name('artwork.show');
});
