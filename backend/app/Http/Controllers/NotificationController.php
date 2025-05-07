<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function getUserNotifications()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Não autenticado.'], 401);
        }

        $notifications = Notification::where('user_id', $userId)
        ->orderByDesc('notification_id')
        ->get();

        return response()->json($notifications); // <-- deve ser um array plano!
    }

    public function markAsRead($id)
{
    $userId = Auth::id();

    $notification = Notification::where('notification_id', $id)
        ->where('user_id', $userId)
        ->first();

    if (!$notification) {
        return response()->json(['error' => 'Notificação não encontrada ou acesso negado.'], 404);
    }

    $notification->idstatus = 2; // LIDA
    $notification->save();

    return response()->json(['success' => true, 'message' => 'Notificação marcada como lida.']);
}

}
