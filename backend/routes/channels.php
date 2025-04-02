<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    return true; // Permite qualquer utilizador autenticar-se no chat
});




