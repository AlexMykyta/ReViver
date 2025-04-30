<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DonationController extends Controller
{
    /**
     * Criar uma nova doação
     */
    public function newDonation(Request $request)
    {
        // Verifica se o utilizador está autenticado
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Precisa de estar autenticado para submeter uma doação.'
            ], 401);
        }

        Log::info('Nova doação recebida', $request->all());

        try {
            // Valida os dados do request
            $validatedData = $request->validate([
                'title' => 'required|string|max:500',
                'description' => 'required|string|max:1000',
                'document' => 'nullable|string', // Imagens em base64
                'contact' => 'required|numeric',
                'category_id' => 'required|integer|exists:itemcategory,category_id',
                'status_id' => 'required|integer|exists:donationstatus,status_id',
            ]);

            // Cria a doação com estado inicial 1 (pendente)
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
            Log::error('Erros de validação:', $e->errors());

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
     * Lista todas as doações do utilizador autenticado
     */
    public function userDonations()
    {
        try {
            if (!Auth::check()) {
                Log::warning('Utilizador não autenticado ao tentar aceder às suas doações.');
                return response()->json(['error' => 'Não autenticado'], 401);
            }

            $userId = Auth::id();
            Log::info("Utilizador autenticado com ID: $userId");

            $donations = Donation::where('created_by', $userId)->get();

            Log::info("Doações encontradas: " . $donations->count());

            return response()->json($donations);

        } catch (\Exception $e) {
            Log::error("Erro inesperado ao buscar doações do utilizador: " . $e->getMessage());
            return response()->json(['error' => 'Erro interno: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Devolve os detalhes de uma doação específica
     */
    public function show($id)
    {
        // Carrega a doação juntamente com os dados do doador
        $donation = Donation::with('donor')->find($id);

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
            'donor_name' => $donation->donor->name ?? null,
        ]);
    }

    /**
     * Lista todas as doações com status_id = 3 (Aprovadas)
     */
    public function index()
    {
        return response()->json(Donation::where('status_id', 3)->get());
    }

    /**
     * Lista os pedidos (doações solicitadas) feitos pelo utilizador autenticado
     */
    public function userRequests()
    {
        try {
            if (!Auth::check()) {
                return response()->json(['error' => 'Não autenticado'], 401);
            }

            $userId = Auth::id();

            // Vai buscar as doações onde o utilizador é o requester
            $requests = Donation::with('donor')->where('requester', $userId)->get();

            return response()->json($requests);

        } catch (\Exception $e) {
            \Log::error("Erro ao buscar pedidos do utilizador: " . $e->getMessage());
            return response()->json(['error' => 'Erro interno: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Solicita uma doação (altera status para 4 e define requester)
     */
    public function requestDonation($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        $donation = Donation::find($id);
        if (!$donation) {
            return response()->json(['error' => 'Doação não encontrada'], 404);
        }

        // Atualiza o estado e define quem a solicitou
        $donation->status_id = 4;
        $donation->requester = Auth::id();
        $donation->save();

        return response()->json(['message' => 'Doação solicitada com sucesso']);
    }

    /**
     * Atualiza uma doação (apenas se for o criador e estiver nos estados 1, 2 ou 3)
     */
    public function update(Request $request, $id)
    {
        $donation = Donation::find($id);
    
        if (!$donation) {
            return response()->json(['error' => 'Doação não encontrada.'], 404);
        }
    
        if ($donation->created_by !== Auth::id()) {
            return response()->json(['error' => 'Acesso não autorizado.'], 403);
        }
    
        if (!in_array($donation->status_id, [1, 2, 3])) {
            return response()->json(['error' => 'Esta doação não pode ser editada.'], 403);
        }
    
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'description' => 'required|string|max:1000',
            'contact' => 'required|numeric',
            'category_id' => 'required|integer|exists:itemcategory,category_id',
            'document' => 'nullable|string', // 👈 necessário para atualizar imagens
        ]);
    
        $donation->update([
            ...$validated,
            'status_id' => 1,
        ]);
    
        return response()->json(['message' => 'Doação atualizada com sucesso.']);
    }
    
}
