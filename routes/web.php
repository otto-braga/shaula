<?php

// -----------------------------------------------------------------------------
// NOMENCLATURA
//
// Rotas devem ter nome igual ao nome de sua respectiva tabela, seguindo a regra
// de pluralização do Laravel.
// Exemplos:
//      /obras -> artworks
//      /pessoas -> people
//
// Rotas públicas devem ter prefixo "public".
// Exemplos:
//      /obras -> public.artworks
//      /pessoas -> public.people
//
// Parâmetros de rotas devem ser uma instância do modelo correspondente, quando
// aplicável. Preferencialmente, o atributo "slug" deve ser utilizado para
// identificar o modelo.
// Exemplos:
//      /obras/{artwork:slug} -> public.artworks.show
//      /pessoas/{person:slug} -> public.people.show
//
// -----------------------------------------------------------------------------

use App\Helpers\ConnectionChecker;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\AwardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\HistoryArticleController;
use App\Http\Controllers\HomePublicController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\Public\ArtworkPublicController;
use App\Http\Controllers\Public\HistoryArticlePublicController;
use App\Http\Controllers\Public\PeriodPublicController;
use App\Http\Controllers\Public\PersonPublicController;
use App\Http\Controllers\Public\ReviewPublicController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SourceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::name('public.')->group(function () {
    Route::get('/', [HomePublicController::class, 'index'])->name('home');

    Route::get('/critica', [ReviewPublicController::class, 'index'])->name('reviews.index');
    Route::get('/critica/{review:slug}', [ReviewPublicController::class, 'show'])->name('reviews.show');

    Route::get('/pessoas', [PersonPublicController::class, 'index'])->name('people.index');
    Route::get('/pessoas/{person:slug}', [PersonPublicController::class, 'show'])->name('people.show');

    Route::get('/obras/{artwork:slug}', [ArtworkPublicController::class, 'show'])->name('artworks.show');

    Route::get('/historia', [HistoryArticlePublicController::class, 'index'])->name('history_articles.index');
    Route::get('/historia/artigo/{historyArticle:slug}', [HistoryArticlePublicController::class, 'show'])->name('history_articles.show');

    Route::get('/historia/periodo/{period:slug}', [PeriodPublicController::class, 'show'])->name('periods.show');

    // Search
    Route::get('busca', [SearchController::class, 'index'])->name('search');
    Route::get('busca/fetch', [SearchController::class, 'fetch'])->name('search.fetch');
    Route::get('busca/fetch/options', [SearchController::class, 'fetchSelectOptions'])->name('search.fetch.options');
    Route::get('busca/fetch/filters', [SearchController::class, 'fetchFilterOptions'])->name('search.filter.fetch.options');
});

Route::group(['middleware' => ['auth', 'verified'], 'prefix' => 'admin', 'as' => ''], function () {
    Route::get('/', function () {
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

    // Periods (Periodização)
    Route::get('periodos', [PeriodController::class, 'index'])->name('periods.index');
    Route::post('periodos', [PeriodController::class, 'store'])->name('periods.store');
    Route::get('periodos/criar', [PeriodController::class, 'create'])->name('periods.create');
    Route::get('periodos/{period}/editar', [PeriodController::class, 'edit'])->name('periods.edit');
    Route::put('periodos/{period}', [PeriodController::class, 'update'])->name('periods.update');
    Route::delete('periodos/{period}', [PeriodController::class, 'destroy'])->name('periods.destroy');
    Route::get('periodos/fetch/options', [PeriodController::class, 'fetchSelectOptions'])->name('periods.fetch.options');

    // Categories
    Route::get('categorias', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categorias/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categorias/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('categorias/fetch/options', [CategoryController::class, 'fetchSelectOptions'])->name('categories.fetch.options');

    // Genders
    Route::get('generos', [GenderController::class, 'index'])->name('genders.index');
    Route::post('generos', [GenderController::class, 'store'])->name('genders.store');
    Route::put('generos/{gender}', [GenderController::class, 'update'])->name('genders.update');
    Route::delete('generos/{gender}', [GenderController::class, 'destroy'])->name('genders.destroy');
    Route::get('generos/fetch/options', [GenderController::class, 'fetchSelectOptions'])->name('genders.fetch.options');

    // Awards
    Route::get('premios', [AwardController::class, 'index'])->name('awards.index');
    Route::post('premios', [AwardController::class, 'store'])->name('awards.store');
    Route::put('premios/{award}', [AwardController::class, 'update'])->name('awards.update');
    Route::delete('premios/{award}', [AwardController::class, 'destroy'])->name('awards.destroy');
    Route::get('premios/fetch/options', [AwardController::class, 'fetchSelectOptions'])->name('awards.fetch.options');

    // Actitivies
    Route::get('atividades', [ActivityController::class, 'index'])->name('activities.index');
    Route::post('atividades', [ActivityController::class, 'store'])->name('activities.store');
    Route::put('atividades/{activity}', [ActivityController::class, 'update'])->name('activities.update');
    Route::delete('atividades/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');
    Route::get('atividades/fetch/options', [ActivityController::class, 'fetchSelectOptions'])->name('activities.fetch.options');

    // Cities
    Route::get('cidades', [CityController::class, 'index'])->name('cities.index');
    Route::post('cidades', [CityController::class, 'store'])->name('cities.store');
    Route::put('cidades/{city}', [CityController::class, 'update'])->name('cities.update');
    Route::delete('cidades/{city}', [CityController::class, 'destroy'])->name('cities.destroy');
    Route::get('cidades/fetch/options', [CityController::class, 'fetchSelectOptions'])->name('cities.fetch.options');

    // Languages
    Route::get('linguagens', [LanguageController::class, 'index'])->name('languages.index');
    Route::post('linguagens', [LanguageController::class, 'store'])->name('languages.store');
    Route::put('linguagens/{language}', [LanguageController::class, 'update'])->name('languages.update');
    Route::delete('linguagens/{language}', [LanguageController::class, 'destroy'])->name('languages.destroy');
    Route::get('linguagens/fetch/options', [LanguageController::class, 'fetchSelectOptions'])->name('languages.fetch.options');

    // People
    Route::get('/pessoas', [PersonController::class, 'index'])->name('people.index');
    Route::get('/pessoas/criar', [PersonController::class, 'create'])->name('people.create');
    Route::post('/pessoas/store', [PersonController::class, 'store'])->name('people.store');
    Route::get('/pessoas/{person:slug}', [PersonController::class, 'show'])->name('people.show');
    Route::get('/pessoas/{person:slug}/editar', [PersonController::class, 'edit'])->name('people.edit');
    Route::post('/pessoas/{person:slug}/update', [PersonController::class, 'update'])->name('people.update');
    Route::get('/pessoas/{person:slug}/editar/imagens', [PersonController::class, 'editImages'])->name('people.edit.images');
    Route::post('/pessoas/{person:slug}/update/images', [PersonController::class, 'updateImages'])->name('people.update.images');
    Route::get('/pessoas/{person:slug}/editar/conteudo', [PersonController::class, 'editContent'])->name('people.edit.content');
    Route::post('/pessoas/{person:slug}/update/content', [PersonController::class, 'updateContent'])->name('people.update.content');
    Route::delete('/pessoas/{person:slug}/delete', [PersonController::class, 'destroy'])->name('people.destroy');
    Route::get('/pessoas/fetch/options', [PersonController::class, 'fetchSelectOptions'])->name('people.fetch.options');

    // Artworks
    Route::get('/obras', [ArtworkController::class, 'index'])->name('artworks.index');
    Route::get('/obras/criar', [ArtworkController::class, 'create'])->name('artworks.create');
    Route::post('/obras/store', [ArtworkController::class, 'store'])->name('artworks.store');
    Route::get('/obras/{artwork:slug}', [ArtworkController::class, 'show'])->name('artworks.show');
    Route::get('/obras/{artwork:slug}/editar', [ArtworkController::class, 'edit'])->name('artworks.edit');
    Route::post('/obras/{artwork:slug}/update', [ArtworkController::class, 'update'])->name('artworks.update');
    Route::get('/obras/{artwork:slug}/editar/pessoas', [ArtworkController::class, 'editPeople'])->name('artworks.edit.people');
    Route::post('/obras/{artwork:slug}/update/people', [ArtworkController::class, 'updatePeople'])->name('artworks.update.people');
    Route::get('/obras/{artwork:slug}/editar/imagens', [ArtworkController::class, 'editImages'])->name('artworks.edit.images');
    Route::post('/obras/{artwork:slug}/update/images', [ArtworkController::class, 'updateImages'])->name('artworks.update.images');
    Route::get('/obras/{artwork:slug}/editar/conteudo', [ArtworkController::class, 'editContent'])->name('artworks.edit.content');
    Route::post('/obras/{artwork:slug}/update/content', [ArtworkController::class, 'updateContent'])->name('artworks.update.content');
    Route::get('/obras/{artwork:slug}/editar/fontes', [ArtworkController::class, 'editSources'])->name('artworks.edit.sources');
    Route::post('/obras/{artwork:slug}/update/sources', [ArtworkController::class, 'updateSources'])->name('artworks.update.sources');
    Route::delete('/obras/{artwork:slug}/delete', [ArtworkController::class, 'destroy'])->name('artworks.destroy');
    Route::get('/obras/fetch/options', [ArtworkController::class, 'fetchSelectOptions'])->name('artworks.fetch.options');

    // Reviews
    Route::get('/criticas', [ReviewController::class, 'index'])->name('reviews.index');
    Route::get('/criticas/criar', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('/criticas/store', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/criticas/{review:slug}', [ReviewController::class, 'show'])->name('reviews.show');
    Route::get('/criticas/{review:slug}/editar', [ReviewController::class, 'edit'])->name('reviews.edit');
    Route::post('/criticas/{review:slug}/update', [ReviewController::class, 'update'])->name('reviews.update');
    Route::get('/criticas/{review:slug}/editar/pessoas', [ReviewController::class, 'editPeople'])->name('reviews.edit.people');
    Route::post('/criticas/{review:slug}/update/people', [ReviewController::class, 'updatePeople'])->name('reviews.update.people');
    Route::get('/criticas/{review:slug}/editar/imagens', [ReviewController::class, 'editImages'])->name('reviews.edit.images');
    Route::post('/criticas/{review:slug}/update/images', [ReviewController::class, 'updateImages'])->name('reviews.update.images');
    Route::get('/criticas/{review:slug}/editar/conteudo', [ReviewController::class, 'editContent'])->name('reviews.edit.content');
    Route::post('/criticas/{review:slug}/update/content', [ReviewController::class, 'updateContent'])->name('reviews.update.content');
    Route::get('/criticas/{review:slug}/editar/fontes', [ReviewController::class, 'editSources'])->name('reviews.edit.sources');
    Route::post('/criticas/{review:slug}/update/sources', [ReviewController::class, 'updateSources'])->name('reviews.update.sources');
    Route::delete('/criticas/{review:slug}/delete', [ReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::get('/criticas/fetch/options', [ReviewController::class, 'fetchSelectOptions'])->name('reviews.fetch.options');

    // History Articles
    Route::get('/artigos-de-historia', [HistoryArticleController::class, 'index'])->name('history_articles.index');
    Route::get('/artigos-de-historia/criar', [HistoryArticleController::class, 'create'])->name('history_articles.create');
    Route::post('/artigos-de-historia/store', [HistoryArticleController::class, 'store'])->name('history_articles.store');
    Route::get('/artigos-de-historia/{historyArticle:slug}', [HistoryArticleController::class, 'show'])->name('history_articles.show');
    Route::get('/artigos-de-historia/{historyArticle:slug}/editar', [HistoryArticleController::class, 'edit'])->name('history_articles.edit');
    Route::post('/artigos-de-historia/{historyArticle:slug}/update', [HistoryArticleController::class, 'update'])->name('history_articles.update');
    Route::get('/artigos-de-historia/{historyArticle:slug}/editar/imagens', [HistoryArticleController::class, 'editImages'])->name('history_articles.edit.images');
    Route::post('/artigos-de-historia/{historyArticle:slug}/update/images', [HistoryArticleController::class, 'updateImages'])->name('history_articles.update.images');
    Route::get('/artigos-de-historia/{historyArticle:slug}/editar/conteudo', [HistoryArticleController::class, 'editContent'])->name('history_articles.edit.content');
    Route::post('/artigos-de-historia/{historyArticle:slug}/update/content', [HistoryArticleController::class, 'updateContent'])->name('history_articles.update.content');
    Route::get('/artigos-de-historia/{historyArticle:slug}/editar/fontes', [HistoryArticleController::class, 'editSources'])->name('history_articles.edit.sources');
    Route::post('/artigos-de-historia/{historyArticle:slug}/update/sources', [HistoryArticleController::class, 'updateSources'])->name('history_articles.update.sources');
    Route::delete('/artigos-de-historia/{historyArticle:slug}/delete', [HistoryArticleController::class, 'destroy'])->name('history_articles.destroy');
    Route::get('/artigos-de-historia/fetch/options', [HistoryArticleController::class, 'fetchSelectOptions'])->name('history_articles.fetch.options');

    // Sources
    Route::get('/fontes', [SourceController::class, 'index'])->name('sources.index');
    Route::get('/fontes/criar', [SourceController::class, 'create'])->name('sources.create');
    Route::post('/fontes/store', [SourceController::class, 'store'])->name('sources.store');
    Route::get('/fontes/{source:slug}', [SourceController::class, 'show'])->name('sources.show');
    Route::get('/fontes/{source:slug}/editar', [SourceController::class, 'edit'])->name('sources.edit');
    Route::post('/fontes/{source:slug}/update', [SourceController::class, 'update'])->name('sources.update');
    Route::delete('/fontes/{source:slug}/delete', [SourceController::class, 'destroy'])->name('sources.destroy');
    Route::get('/fontes/fetch/options', [SourceController::class, 'fetchSelectOptions'])->name('sources.fetch.options');

    // Source Categories
    Route::get('/categorias-fontes/fetch/options', [SourceController::class, 'fetchCategorySelectOptions'])->name('source_categories.fetch.options');

    // Connection Checks
    Route::get('/check/db', [ConnectionChecker::class, 'isDatabaseReady'])->name('check.db');
    Route::get('/check/redis', [ConnectionChecker::class, 'isRedisReady'])->name('check.redis');
});

// require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
// require __DIR__ . '/public.php';
