<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\UploadController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/pages/slug/{slug}', [PageController::class, 'showBySlug']);
Route::apiResource('pages', PageController::class)->except(['destroy']);
Route::post('/ai/generate', [AiController::class, 'generate']);
Route::post('/ai/generate-ui', [AiController::class, 'generateUi']);
Route::post('/upload', [UploadController::class, 'store']);
