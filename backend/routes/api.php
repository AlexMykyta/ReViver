<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\VolunteerRequestController;
use App\Http\Controllers\NotificationController; // <--- ADICIONAR ESTA LINHA AQUI


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
Route::middleware('auth:sanctum')->get('/notifications', [NotificationController::class, 'getUserNotifications']);
Route::middleware('auth:sanctum')->put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);



// ROTAS PÚBLICAS CONTINUADAS
Route::get('/donations', [DonationController::class, 'index']);

Route::get('/donations/{id}', [DonationController::class, 'show']);



// ROTAS PROTEGIDAS GLOBAIS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/donations', [DonationController::class, 'newDonation']);
    Route::put('/donations/{id}/decision', [DonationController::class, 'approveOrRejectDonations']);
    Route::post('/volunteer-requests', [VolunteerRequestController::class, 'store']);
    Route::get('/volunteer-requests/getAll', [VolunteerRequestController::class, 'getAll']);
    Route::get('/volunteer-requests/getPedding', [VolunteerRequestController::class, 'getPedding']);
    Route::put('/volunteer-requests/updateStatus', [VolunteerRequestController::class, 'updateStatus']);
    Route::put('/donations/{id}/request', [DonationController::class, 'requestDonation']);
    Route::delete('/donations/{id}', [DonationController::class, 'destroy']);
    Route::put('/donations/{id}', [DonationController::class, 'update']); 
    Route::get('/pending-donations', [DonationController::class, 'getPendingDonations']);    
    Route::get('/orders-incollection', [DonationController::class, 'getOrdersIncollection']);
    Route::put('/donations/{id}/delivering', [DonationController::class, 'markDelivering']);

});
