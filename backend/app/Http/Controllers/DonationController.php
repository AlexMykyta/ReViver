<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Notification;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DonationController extends Controller
{
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
                'document' => 'nullable|string',
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

    public function show($id)
    {
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

    public function index()
    {
        return response()->json(Donation::where('status_id', 3)->get());
    }

    public function userRequests()
    {
        $userId = Auth::id();

        $donations = Donation::where('requester', $userId)
            ->orderByDesc('date')
            ->with('donor')
            ->get();

        return response()->json($donations);
    }

    public function requestDonation($id)
    {
        $donation = Donation::findOrFail($id);
        $user = Auth::user();

        $donation->status_id = 4;
        $donation->requester = Auth::id();
        $donation->save();

        try {
            Notification::create([
                'user_id' => $donation->created_by,
                'title' => 'Nova solicitação',
                'message' => $user->name . " solicitou a doação: " . $donation->title,
                'date' => Carbon::now(),
                'idstatus' => 1,
            ]);
            Log::info("Notificação criada com sucesso.");
        } catch (\Exception $e) {
            Log::error("Erro ao criar notificação: " . $e->getMessage());
        }

        return response()->json(['message' => 'Solicitação feita com sucesso']);
    }

    public function update(Request $request, $id)
    {
        $donation = Donation::find($id);
    
        if (!$donation) {
            return response()->json([
                'success' => false,
                'message' => 'Doação não encontrada.'
            ], 404);
        }
    
        if ($donation->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Acesso não autorizado.'
            ], 403);
        }
    
        if (!in_array($donation->status_id, [1, 2, 3, 4, 6, 7])) {
            return response()->json([
                'success' => false,
                'message' => 'Esta doação não pode ser editada.'
            ], 403);
        }
    
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:500',
            'description' => 'sometimes|required|string|max:1000',
            'contact' => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|integer|exists:itemcategory,category_id',
            'status_id' => 'sometimes|required|integer|in:1,2,3,4,5,6,7',
            'document' => 'sometimes|nullable|string',
        ]);
    
        $donation->update($validated);
    
        // ✅ Notificações
        if (isset($validated['status_id'])) {
            $status = $validated['status_id'];
    
            // Se a doação passou para "Em Recolha" ou "A Ser Entregue"
            if (in_array($status, [6, 7]) && $donation->requester) {
                $entregaTexto = $status === 6
                    ? 'será recolhida por um voluntário'
                    : 'será entregue pelo próprio doador';
    
                // Notificar o requester
                Notification::create([
                    'user_id' => $donation->requester,
                    'title' => 'Entrega da Doação',
                    'message' => "A doação '{$donation->title}' {$entregaTexto}.",
                    'date' => Carbon::now(),
                    'idstatus' => 1
                ]);
    
                // Se for recolha por voluntário, notificar todos os voluntários
                if ($status === 6) {
                    $volunteers = User::where('role_id', 2)->get();
                    foreach ($volunteers as $volunteer) {
                        Notification::create([
                            'user_id' => $volunteer->user_id,
                            'title' => 'Nova entrega disponível',
                            'message' => "Está disponível uma doação para recolher: '{$donation->title}'.",
                            'date' => Carbon::now(),
                            'idstatus' => 1
                        ]);
                    }
                }
            }
    
            // ✅ Se passou para Terminado (status 5), notificar o requester
            if ($status === 5 && $donation->requester) {
                Notification::create([
                    'user_id' => $donation->requester,
                    'title' => 'Doação Entregue',
                    'message' => "A doação '{$donation->title}' foi entregue com sucesso.",
                    'date' => Carbon::now(),
                    'idstatus' => 1
                ]);
            }
        }
    
        return response()->json([
            'success' => true,
            'message' => 'Doação atualizada com sucesso.'
        ]);
    }

    public function destroy($id)
{
    $donation = \App\Models\Donation::find($id);

    if (!$donation) {
        return response()->json(['message' => 'Doação não encontrada.'], 404);
    }

    if ($donation->created_by !== auth()->id()) {
        return response()->json(['message' => 'Acesso não autorizado.'], 403);
    }

    $donation->delete();

    return response()->json(['message' => 'Doação eliminada com sucesso.'], 200);
}

    
}
