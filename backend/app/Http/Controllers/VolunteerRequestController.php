<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;

class VolunteerRequestController extends Controller
{
    /**
     * Store a new volunteer request
     */
    public function store(Request $request)
    {

        $user_id = Auth::id();
    
        $existingRequest = Report::where('user_id', $user_id)->first();
    
        if ($existingRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Já existe uma solicitação pendente para este usuário',
            ], 409);
        }
        

        $validated = $request->validate([
            'availability' => 'required|in:weekends,weekdays,evenings',
            'motivation' => 'required|string|min:10',
            'role_id' => 'sometimes|integer'
        ]);



        $aux = 0;
        if($validated['availability'] == "weekdays"){
            $aux = 1;
        }
        else if($validated['availability'] == "weekends"){
            $aux = 2;
        }
        else if($validated['availability'] == "evenings"){
            $aux = 3;
        }

        $user = Auth::user();

        try {
            $report = Report::create([
                'user_id' => $user->user_id,
                "name" => $user->name,
                'motivation' => $validated['motivation'],
                'availability' => $aux,
                'status' => 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Solicitação de voluntário enviada com sucesso!',
                'data' => $report
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao enviar solicitação: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPedding(){
        $reports = Report::where('status', 1)->get();

        return response()->json(['reports' => $reports], 200);
    }


    public function getAll(){
        $reports = Report::with(['user', 'userAvailability'])->get();

        return response()->json(['reports' => $reports], 200);
    }
    /**
     * List all volunteer requests (for admin)
     */
    public function index()
    {
        $requests = Report::with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    
    
    public function updateStatus(Request $request)
    {
        $user_id = Auth::id();
        

        $validated = $request->validate([
            'id' => 'required|integer|exists:report,id',
            'status' => 'required|string|in:aprovado,rejeitado'
        ]);


        $statusMap = [
            'aprovado' => 2, 
            'rejeitado' => 3 
        ];

        try {
            $volunteerRequest = Report::findOrFail($validated['id']);

            $volunteerRequest->update([
                'status' => $statusMap[$validated['status']],
                'aproved_by' => $user_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status atualizado com sucesso',
                'data' => [
                    'id' => $volunteerRequest->id,
                    'new_status' => $validated['status'],
                    'aproved_by' => $user_id
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar status: ' . $e->getMessage()
            ], 500);
        }
    }
}
