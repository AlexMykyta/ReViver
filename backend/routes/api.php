<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\VolunteerRequestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aqui registam-se as rotas da tua API. Estas rotas são carregadas pelo
| RouteServiceProvider e estão atribuídas ao grupo "api".
|
*/

// ROTAS PÚBLICAS
Route::post('login',[AuthController::class,'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/donations/{id}', [DonationController::class, 'show']);
Route::get('/donations', [DonationController::class, 'index']); // <- AGORA AQUI!

// ROTAS PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/donations', [DonationController::class, 'newDonation']);      
    Route::get('/donations/user', [DonationController::class, 'userDonations']);         
    Route::post('/volunteer-requests', [VolunteerRequestController::class, 'store']);
    Route::get('/volunteer-requests/getAll', [VolunteerRequestController::class, 'getAll']);
    Route::get('/volunteer-requests/getPedding', [VolunteerRequestController::class, 'getPedding']);
    Route::put('/volunteer-requests/updateStatus', [VolunteerRequestController::class, 'updateStatus']);

});

