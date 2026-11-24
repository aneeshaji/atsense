<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$currentEnv = function_exists('env') ? env('APP_ENV') : ($_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'local');
$isSubdirectory = ($currentEnv === 'production') && 
    (dirname($_SERVER['SCRIPT_NAME'] ?? '') === '/api' || dirname($_SERVER['SCRIPT_NAME'] ?? '') === '\\api');
$apiPrefix = $isSubdirectory ? '' : 'api';

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: $apiPrefix,
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
