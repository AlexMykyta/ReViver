<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class UserTest extends TestCase
{
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'dasdasd',
            'email' => 'DdsdsdD@gmail.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => 1,
            'status_id' => 2,
             'contact' => '910000000'
             
        ]);

        $response->assertStatus(201); 
        $this->assertDatabaseHas('users', [
            'email' => 'stefanieadams@gmail.com',
        ]);
    }
}
