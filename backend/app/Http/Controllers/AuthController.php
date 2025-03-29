<?php

namespace App\Http\Controllers;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json(['error' => 'Credenciais inválidas.'], 200);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Credenciais inválidas.'], 200);
        }

        if ($user->status_id == 1) {
            return response()->json(['error' => 'Conta inativa. Contacte o administrador.'], 200);
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Login bem-sucedido!',
            'user' => $user,
            'token' => $user->createToken('authToken')->plainTextToken
        ], 200);

    }

}
