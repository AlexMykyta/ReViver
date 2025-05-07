<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DonationTest extends TestCase
{

    public function test_user_can_create_donation()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/donations', [
            'title' => 'Roupa para criança',
            'description' => 'Roupas em bom estado',
            'contact' => '912345678',
            'category_id' => 1, 
            'status_id' => 1,   
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('donation', [
            'title' => 'Roupa para criança',
            'created_by' => $user->user_id,
        ]);
    }

public function test_user_can_list_their_donations()
{
    $user = \App\Models\User::factory()->create();

    \App\Models\Donation::factory()->count(3)->create([
        'created_by' => $user->user_id
    ]);

    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/donations/user');

    $response->assertStatus(200);
    $response->assertJsonCount(3); 
}

public function test_user_can_delete_donation()
{
    $user = \App\Models\User::factory()->create();

    $donation = \App\Models\Donation::create([
        'title' => 'Para eliminar',
        'description' => 'Esta será eliminada',
        'contact' => '912345678',
        'category_id' => 1,
        'status_id' => 1,
        'created_by' => $user->user_id,
        'date' => now(),
    ]);

    $this->actingAs($user, 'sanctum');

    $response = $this->deleteJson('/api/donations/' . $donation->donation_id);

    $response->assertStatus(200); 
    $this->assertDatabaseMissing('donation', [
        'donation_id' => $donation->donation_id,
    ]);
}

}
