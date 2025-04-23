<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DonationController extends Controller
{
    /**
     * Registar nova doação
     */
    public function newDonation(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Precisa de estar autenticado para submeter uma doação.'
            ], 401);
        }
        Log::info('Nova doação recebida', $request->all());

        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:500',
                'description' => 'required|string|max:1000',
                'document' => 'nullable|string', // Base64 da imagem
                'contact' => 'required|numeric',
                'category_id' => 'required|integer|exists:itemcategory,category_id',
                'status_id' => 'required|integer|exists:donationstatus,status_id',

            ]);

            $donation = Donation::create([
                'created_by' => Auth::id(),
                'date' => now(),
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'document' => $validatedData['document'] ?? null,
                'contact' => $validatedData['contact'],
                'category_id' => $validatedData['category_id'],
                'status_id' => '1',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Doação registada com sucesso!',
                'donation_id' => $donation->donation_id
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Erros de validação:', $e->errors());

            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erro ao registar doação: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erro ao registar a doação: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar doações do utilizador autenticado
     */
    public function userDonations()
    {
        $donations = Donation::where('created_by', Auth::id())->get();

        return response()->json($donations);
    }

    /**
     * Detalhes de uma doação
     */
    public function show($id)
    {
        $donation = Donation::with('donor')->find($id); // <- importante o with('donor')
    
        if (!$donation) {
            return response()->json(['error' => 'Doação não encontrada.'], 404);
        }
    
        return response()->json([
            'donation_id' => $donation->donation_id,
            'title' => $donation->title,
            'description' => $donation->description,
            'contact' => $donation->contact,
            'date' => $donation->date,
            'document' => $donation->document,
            'category_id' => $donation->category_id,
            'status_id' => $donation->status_id,
            'created_by' => $donation->created_by,
            'donor_name' => $donation->donor->name ?? null, // <- aqui vais buscar o nome do user
        ]);
    }
    

    public function index()
    {
        return response()->json(Donation::where('status_id', 3)->get());
    }

    
}
