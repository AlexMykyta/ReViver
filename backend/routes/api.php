<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\VolunteerRequestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ROTAS PÚBLICAS
Route::post('login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ROTAS PROTEGIDAS ESPECÍFICAS
Route::middleware('auth:sanctum')->get('/donations/user', [DonationController::class, 'userDonations']);
Route::middleware('auth:sanctum')->get('/donations/requests', [DonationController::class, 'userRequests']);

// ROTAS PÚBLICAS CONTINUADAS
Route::get('/donations', [DonationController::class, 'index']);
Route::get('/donations/{id}', [DonationController::class, 'show']);

// ROTAS PROTEGIDAS GLOBAIS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/donations', [DonationController::class, 'newDonation']);
    Route::post('/volunteer-requests', [VolunteerRequestController::class, 'store']);
    Route::get('/volunteer-requests/getAll', [VolunteerRequestController::class, 'getAll']);
    Route::get('/volunteer-requests/getPedding', [VolunteerRequestController::class, 'getPedding']);
    Route::put('/volunteer-requests/updateStatus', [VolunteerRequestController::class, 'updateStatus']);
    Route::put('/donations/{id}/request', [DonationController::class, 'requestDonation']);
    Route::put('/donations/{id}', [DonationController::class, 'update']); 
});
