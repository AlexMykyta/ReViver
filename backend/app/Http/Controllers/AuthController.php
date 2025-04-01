<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Registro de novo usuário
     */
    public function register(Request $request)
{
    \Log::info('Tentativa de registro iniciada', $request->all());

    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255', // Campo único para nome completo
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validatedData['name'], // Armazena o nome completo
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role_id' => 1,
            'status_id' => 2,
        ]);

        \Log::info('Usuário criado com ID: '.$user->id);

        return response()->json([
            'success' => true,
            'message' => 'Registro bem-sucedido!',
            'user_id' => $user->id
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Erro no registro: '.$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erro no servidor: '.$e->getMessage()
        ], 500);
    }
}

    /**
     * Login do usuário
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'E-mail não cadastrado.'], 404);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Senha incorreta.'], 401);
        }

        if ($user->status_id == 1) {
            return response()->json(['message' => 'Conta inativa. Contacte o administrador.'], 403);
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Login bem-sucedido!',
            'user' => [
                'id' => $user->user_id,
                'email' => $user->email,
                'role' => $user->role_id,
            ],
            'token' => $user->createToken('authToken')->plainTextToken
        ], 200);
    }
}