<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImageUploadController;

Route::view('/', 'welcome')->name('home');

Route::view('/editor', 'editor');

Route::post('/upload-image', [ImageUploadController::class, 'store']);
