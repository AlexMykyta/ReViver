<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\VolunteerRequestController;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    
    // Solicitações para ser voluntário
    Route::post('/volunteer-requests', [VolunteerRequestController::class, 'store']);
        Route::get('/volunteer-requests/getAll', [VolunteerRequestController::class, 'getAll']);

    // Rotas para admin
    /*Route::middleware('admin')->group(function () {
        Route::get('/volunteer-requests', [VolunteerRequestController::class, 'index']);
        Route::put('/volunteer-requests/{id}', [VolunteerRequestController::class, 'update']);
    });*/
});

Route::post('login',[AuthController::class,'login']);
Route::post('/register', [AuthController::class, 'register']);
