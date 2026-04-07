<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sitemap.xml', [\App\Http\Controllers\Api\SitemapController::class, 'index']);
Route::get('/robots.txt', function () {
    return response("User-agent: *\nAllow: /\nSitemap: https://atsense.online/sitemap.xml", 200, ['Content-Type' => 'text/plain']);
});
