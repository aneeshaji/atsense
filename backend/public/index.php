<?php

@mkdir(__DIR__.'/../storage/framework/cache/data', 0775, true);
@mkdir(__DIR__.'/../storage/framework/views', 0775, true);
@mkdir(__DIR__.'/../storage/framework/sessions', 0775, true);
@mkdir(__DIR__.'/../storage/logs', 0775, true);
@mkdir(__DIR__.'/../bootstrap/cache', 0775, true);

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
